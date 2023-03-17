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
  inserted: Shape[];
  deleted: Shape[];
  transformed: Array<{
    from: Shape;
    to: Shape;
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

    diffSequence(
      aLength,
      bLength,
      (aIndex, bIndex) => {
        return this.isNodeEqual(aNodes[aIndex], bNodes[bIndex]);
      },
      (nCommon, aCommon, bCommon) => {
        if (aIndex !== aCommon)
          diff.deleted.push(...aNodes.slice(aIndex, aCommon));
        if (bIndex !== bCommon)
          diff.inserted.push(...bNodes.slice(bIndex, bCommon));

        aIndex = aCommon;
        bIndex = bCommon;
        for (let x = 0; x < nCommon; x++) {
          diff.transformed.push({
            from: aNodes[aIndex],
            to: bNodes[bIndex],
          });
          aIndex++;
          bIndex++;
        }
      },
    );

    if (aIndex !== aLength) diff.deleted.push(...aNodes.slice(aIndex));

    if (bIndex !== bNodes.length) diff.inserted.push(...bNodes.slice(bIndex));

    diff.deleted = diff.deleted.filter(aNode => {
      const bIndex = diff.inserted.findIndex(bNode =>
        this.isNodeEqual(aNode, bNode),
      );
      if (bIndex >= 0) {
        const bNode = diff.inserted[bIndex];
        diff.inserted.splice(bIndex, 1);
        diff.transformed.push({
          from: aNode,
          to: bNode,
        });

        return false;
      }

      return true;
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
    const transformed = diff.transformed.map(({from, to}) => ({
      from: this.cloneNodeExact(from),
      current: from,
      to,
    }));

    for (const node of diff.inserted) this.wrapper.add(node);

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
        for (const node of diff.deleted) node.opacity(deletedOpacity);

        const insertedOpacity = clampRemap(ending - overlap, 1, 0, 1, progress);
        for (const node of diff.inserted) node.opacity(insertedOpacity);
      },
      () => {
        this.wrapper.children(this.parsedNodes);
        if (autoWidth) this.customWidth(null);
        if (autoHeight) this.customHeight(null);
      },
    );
  }
}
