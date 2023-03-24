import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';
import {BBox, SerializedVector2, Vector2} from '@motion-canvas/core/lib/types';
import {computed, signal} from '../decorators';
import {Shape, ShapeProps} from './Shape';
import {Node} from './Node';
import {DesiredLength, PossibleCanvasStyle} from '../partials';
import {useLogger} from '@motion-canvas/core/lib/utils';
import {Path} from './Path';
import {Rect} from './Rect';
import {
  clampRemap,
  easeInOutSine,
  TimingFunction,
  tween,
} from '@motion-canvas/core/lib/tweening';
import {Layout} from './Layout';
import diffSequence from 'diff-sequences';
import {lazy, threadable} from '@motion-canvas/core/lib/decorators';
import {View2D} from './View2D';

interface ParsedSVG {
  size: Vector2;
  nodes: Shape[];
}

interface SVGDiff {
  fromSize: Vector2;
  toSize: Vector2;
  inserted: Array<{
    fromIndex: number;
    toIndex: number;
    shape: Shape;
  }>;
  deleted: Array<{
    index: number;
    shape: Shape;
  }>;
  transformed: Array<{
    from: Shape;
    to: Shape;
    move?: {
      from: number;
      to: number;
    };
  }>;
}

export interface SVGProps extends ShapeProps {
  svg?: SignalValue<string>;
}

export class SVG extends Shape {
  @lazy(() => {
    const element = document.createElement('div');
    View2D.shadowRoot.appendChild(element);
    return element;
  })
  protected static containerElement: HTMLDivElement;
  @signal()
  public declare readonly svg: SimpleSignal<string, this>;
  public wrapper: Node;

  public constructor(props: SVGProps) {
    super(props);
    this.wrapper = new Node({});
    this.wrapper.children(this.parsedNodes);
    this.add(this.wrapper);
  }

  protected override desiredSize(): SerializedVector2<DesiredLength> {
    const custom = super.desiredSize();
    const {x, y} = this.parsed().size.mul(this.wrapper.scale());
    return {
      x: custom.x ?? x,
      y: custom.y ?? y,
    };
  }

  @computed()
  private parsed() {
    return this.parseSVG(this.svg());
  }

  @computed()
  private parsedNodes() {
    return this.parsed().nodes;
  }

  private parseSVG(svg: string): ParsedSVG {
    SVG.containerElement.innerHTML = svg;

    const svgRoot = SVG.containerElement.querySelector('svg')!;
    const {x, y, width, height} = svgRoot.viewBox.baseVal;
    const viewBox = new BBox(x, y, width, height);
    const size = new Vector2(
      svgRoot.width.baseVal.value,
      svgRoot.height.baseVal.value,
    );
    const scale = size.div(viewBox.size);
    const center = viewBox.center;

    const rootTransform = new DOMMatrix()
      .scaleSelf(scale.x, scale.y)
      .translateSelf(-center.x, -center.y);

    const nodes = Array.from(
      this.extractGroupShape(svgRoot, svgRoot, rootTransform, {}),
    );
    return {
      size,
      nodes,
    };
  }

  private getElementTransformation(
    element: SVGGraphicsElement,
    parentTransform: DOMMatrix,
  ) {
    const transform = element.transform.baseVal.consolidate();
    const x = element.getAttribute('x');
    const y = element.getAttribute('y');
    const transformMatrix = (
      transform ? parentTransform.multiply(transform.matrix) : parentTransform
    ).translate(parseFloat(x ?? '0'), parseFloat(y ?? '0'));
    return transformMatrix;
  }

  private parseColor(color: string | null): SignalValue<PossibleCanvasStyle> {
    if (color == 'currentColor') return this.fill;
    return color;
  }

  private getElementStyle(
    element: SVGGraphicsElement,
    inheritedStyle: ShapeProps,
  ): ShapeProps {
    return {
      fill:
        this.parseColor(element.getAttribute('fill')) ?? inheritedStyle.fill,
      stroke:
        this.parseColor(element.getAttribute('stroke')) ??
        inheritedStyle.stroke,
      lineWidth: element.hasAttribute('stroke-width')
        ? parseFloat(element.getAttribute('stroke-width')!)
        : inheritedStyle.lineWidth,
      layout: false,
    };
  }

  private applyTransformToShape(shape: Shape, transform: DOMMatrix) {
    const position = {
      x: transform.m41,
      y: transform.m42,
    };
    const rotation = (Math.atan2(transform.m12, transform.m11) * 180) / Math.PI;
    const scale = {
      x: Vector2.magnitude(transform.m11, transform.m12),
      y: Vector2.magnitude(transform.m21, transform.m22),
    };
    const determinant =
      transform.m11 * transform.m22 - transform.m12 * transform.m21;
    if (determinant < 0) {
      if (transform.m11 < transform.m22) scale.x = -scale.x;
      else scale.y = -scale.y;
    }
    shape.position(position);
    shape.rotation(rotation);
    shape.scale(scale);
  }

  private *extractGroupShape(
    element: SVGElement,
    svgRoot: Element,
    parentTransform: DOMMatrix,
    inheritedStyle: ShapeProps,
  ): Generator<Shape> {
    for (const child of element.children) {
      if (!(child instanceof SVGGraphicsElement)) continue;

      yield* this.extractElementShape(
        child,
        svgRoot,
        parentTransform,
        inheritedStyle,
      );
    }
  }

  private *extractElementShape(
    child: SVGGraphicsElement,
    svgRoot: Element,
    parentTransform: DOMMatrix,
    inheritedStyle: ShapeProps,
  ): Generator<Shape> {
    const transformMatrix = this.getElementTransformation(
      child,
      parentTransform,
    );
    const style = this.getElementStyle(child, inheritedStyle);
    if (child.tagName == 'g')
      yield* this.extractGroupShape(child, svgRoot, transformMatrix, style);
    else if (child.tagName == 'use') {
      const hrefElement = svgRoot.querySelector(
        (child as SVGUseElement).href.baseVal,
      )!;
      if (!(hrefElement instanceof SVGGraphicsElement)) return;

      yield* this.extractElementShape(
        hrefElement,
        svgRoot,
        transformMatrix,
        inheritedStyle,
      );
    } else if (child.tagName == 'path') {
      const data = child.getAttribute('d');
      if (!data) {
        useLogger().warn('blank path data at ' + child.id);
        return;
      }
      const path = new Path({
        data,
        ...style,
      });
      const center = path.getPathBBox().center;
      this.applyTransformToShape(
        path,
        transformMatrix.translate(center.x, center.y),
      );
      yield path;
    } else if (child.tagName == 'rect') {
      const width = parseFloat(child.getAttribute('width') ?? '0');
      const height = parseFloat(child.getAttribute('height') ?? '0');
      const center = new BBox(0, 0, width, height).center;
      const rect = new Rect({
        width,
        height,
        ...style,
      });
      this.applyTransformToShape(
        rect,
        transformMatrix.translate(center.x, center.y),
      );
      yield rect;
    }
  }

  private isNodeEqual(aShape: Node, bShape: Node): boolean {
    if (aShape.constructor !== bShape.constructor) return false;
    if (
      aShape instanceof Path &&
      bShape instanceof Path &&
      aShape.data() !== bShape.data()
    )
      return false;

    return true;
  }

  private diffSVG(from: ParsedSVG, to: ParsedSVG): SVGDiff {
    const diff: SVGDiff = {
      fromSize: from.size,
      toSize: to.size,
      inserted: [],
      deleted: [],
      transformed: [],
    };

    const aNodes = from.nodes;
    const bNodes = to.nodes;
    const aLength = aNodes.length;
    const bLength = bNodes.length;
    let aIndex = 0;
    let bIndex = 0;
    const nNodes: Shape[] = [];
    const fNodes: Shape[] = [];

    diffSequence(
      aLength,
      bLength,
      (aIndex, bIndex) => {
        return this.isNodeEqual(aNodes[aIndex], bNodes[bIndex]);
      },
      (nCommon, aCommon, bCommon) => {
        if (aIndex !== aCommon)
          aNodes.slice(aIndex, aCommon).forEach((shape, index) => {
            diff.deleted.push({
              index: aIndex + index,
              shape,
            });
            nNodes.push(shape);
            fNodes.push(shape);
          });
        if (bIndex !== bCommon) {
          bNodes.slice(bIndex, bCommon).forEach((shape, index) => {
            diff.inserted.push({
              fromIndex: aIndex,
              toIndex: bIndex + index,
              shape,
            });
            nNodes.push(shape);
            fNodes.push(shape);
          });
        }

        aIndex = aCommon;
        bIndex = bCommon;
        for (let x = 0; x < nCommon; x++) {
          diff.transformed.push({
            from: aNodes[aIndex],
            to: bNodes[bIndex],
          });
          nNodes.push(aNodes[aIndex]);
          fNodes.push(bNodes[bIndex]);
          aIndex++;
          bIndex++;
        }
      },
    );

    if (aIndex !== aLength)
      aNodes.slice(aIndex).forEach((shape, index) => {
        diff.deleted.push({
          shape,
          index: aIndex + index,
        });
        nNodes.push(shape);
        fNodes.push(shape);
      });

    if (bIndex !== bNodes.length)
      bNodes.slice(bIndex).forEach((shape, index) => {
        diff.inserted.push({
          fromIndex: aLength,
          toIndex: bIndex + index,
          shape,
        });
        nNodes.push(shape);
        fNodes.push(shape);
      });

    const moved: SVGDiff['transformed'] = [];
    diff.deleted = diff.deleted.filter(aNode => {
      const insertIndex = diff.inserted.findIndex(bNode =>
        this.isNodeEqual(aNode.shape, bNode.shape),
      );
      if (insertIndex >= 0) {
        const bNode = diff.inserted[insertIndex];
        diff.inserted.splice(insertIndex, 1);
        nNodes.splice(nNodes.indexOf(bNode.shape), 1);
        fNodes.splice(fNodes.indexOf(aNode.shape), 1);
        moved.push({
          from: aNode.shape,
          to: bNode.shape,
          move: {
            from: 0,
            to: 0,
          },
        });

        return false;
      }

      return true;
    });

    diff.inserted.forEach((value, index) => {
      value.fromIndex += index;
    });

    diff.transformed.push(...moved);
    diff.transformed.forEach(node => {
      node.move = {
        from: 0,
        to: 0,
      };
      node.move!.from = nNodes.indexOf(node.from);
      node.move!.to = fNodes.indexOf(node.to);
    });
    diff.transformed = diff.transformed.sort((a, b) => {
      const sub =
        Math.min(a.move!.from, a.move!.to) - Math.min(b.move!.from, b.move!.to);
      if (sub === 0) {
        if (Math.sign(a.move!.to - a.move!.from) < 0) return 1;
        if (Math.sign(b.move!.to - b.move!.from) < 0) return -1;
      }
      return sub;
    });

    return diff;
  }

  private cloneNodeExact(node: Node) {
    const props: ShapeProps = {
      position: node.position(),
      scale: node.scale(),
      rotation: node.rotation(),
    };
    if (node instanceof Layout) {
      props.size = node.size();
    }
    return node.clone(props);
  }

  @threadable()
  protected *tweenSvg(
    value: SignalValue<string>,
    time: number,
    timingFunction: TimingFunction,
  ) {
    const newValue = typeof value == 'string' ? value : value();
    const newSVG = this.parseSVG(newValue);
    const diff = this.diffSVG(this.parsed(), newSVG);

    for (const node of diff.inserted)
      this.wrapper.insert(node.shape, node.fromIndex);

    const transformed = diff.transformed.map(({from, to, ...rest}) => ({
      from: this.cloneNodeExact(from),
      current: from,
      to,
      ...rest,
    }));
    let orderMoved = false;
    const moveOrder = () => {
      if (orderMoved) return;
      this.wrapper.children();
      for (const diff of transformed) {
        if (!diff.move) continue;
        useLogger().info(`move from ${diff.move.from} to ${diff.move.to}`);
        diff.current.moveTo(diff.move.to);
      }
      orderMoved = true;
    };

    const autoWidth = this.customWidth() == null;
    const autoHeight = this.customHeight() == null;

    const beginning = 0.2;
    const ending = 0.8;
    const overlap = 0.15;

    yield* tween(
      time,
      value => {
        const progress = timingFunction(value);
        const remapped = clampRemap(beginning, ending, 0, 1, progress);
        const eased = easeInOutSine(remapped);

        if (remapped > 0.5) moveOrder();

        for (const node of transformed) {
          node.current.position(
            Vector2.lerp(node.from.position(), node.to.position(), eased),
          );
          node.current.scale(
            Vector2.lerp(node.from.scale(), node.to.scale(), eased),
          );
          node.current.rotation(
            easeInOutSine(remapped, node.from.rotation(), node.to.rotation()),
          );

          node.current.size(
            Vector2.lerp(
              (node.from as Layout).size(),
              (node.to as Layout).size(),
              eased,
            ),
          );
        }

        const scale = this.wrapper.scale();
        if (autoWidth)
          this.customWidth(
            easeInOutSine(remapped, diff.fromSize.x, diff.toSize.x) * scale.x,
          );

        if (autoHeight)
          this.customHeight(
            easeInOutSine(remapped, diff.fromSize.y, diff.toSize.y) * scale.y,
          );

        const deletedOpacity = clampRemap(
          0,
          beginning + overlap,
          1,
          0,
          progress,
        );
        for (const node of diff.deleted) node.shape.opacity(deletedOpacity);

        const insertedOpacity = clampRemap(ending - overlap, 1, 0, 1, progress);
        for (const node of diff.inserted) node.shape.opacity(insertedOpacity);
      },
      () => {
        const nodes = [...this.wrapper.children()];
        for (const deleted of diff.deleted) {
          nodes.splice(nodes.indexOf(deleted.shape), 1);
        }
        nodes.forEach((node, index) => {
          const destNode = newSVG.nodes[index];
          if (!this.isNodeEqual(node, destNode))
            useLogger().error('node at ' + index + ' is not equal');
        });

        this.wrapper.children(this.parsedNodes);
        if (autoWidth) this.customWidth(null);
        if (autoHeight) this.customHeight(null);

        for (const node of diff.deleted) node.shape.dispose();
        for (const node of transformed) {
          node.from.dispose();
          node.current.dispose();
        }
      },
    );
  }
}
