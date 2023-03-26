import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';
import {BBox, SerializedVector2, Vector2} from '@motion-canvas/core/lib/types';
import {computed, signal} from '../decorators';
import {Shape, ShapeProps} from './Shape';
import {Node, NodeProps} from './Node';
import {DesiredLength} from '../partials';
import {useLogger} from '@motion-canvas/core/lib/utils';
import {Path, PathProps} from './Path';
import {Rect, RectProps} from './Rect';
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

export interface SVGChildNode {
  id: string;
  shape: Node;
}

export interface RawSVGChild {
  id: string;
  type: new (props: NodeProps) => Node;
  props: ShapeProps;
  transformation: DOMMatrix;
  bbox: BBox;
  children?: RawSVGChild[];
}

export interface ParsedSVG {
  size: Vector2;
  nodes: SVGChildNode[];
}

export interface RawSVG {
  size: Vector2;
  nodes: RawSVGChild[];
}

interface SVGDiff {
  fromSize: Vector2;
  toSize: Vector2;
  inserted: Array<{
    fromIndex: number;
    node: SVGChildNode;
  }>;
  deleted: Array<SVGChildNode>;
  transformed: Array<{
    from: SVGChildNode;
    to: SVGChildNode;
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
  private static svgNodesPool: Record<string, RawSVG> = {};
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
    return this.parsed().nodes.map(node => node.shape);
  }

  protected buildParsedSVG(builder: RawSVG): ParsedSVG {
    return {
      size: builder.size,
      nodes: builder.nodes.map(ch => this.buildRawNode(ch)),
    };
  }

  protected buildRawNode({
    id,
    type,
    props,
    children,
  }: RawSVGChild): SVGChildNode {
    return {
      id,
      shape: new type({
        children: children?.map(ch => this.buildRawNode(ch).shape),
        ...this.processElementStyle(props),
      }),
    };
  }

  protected parseSVG(svg: string): ParsedSVG {
    return this.buildParsedSVG(SVG.parseSVGasRaw(svg));
  }

  protected static parseSVGasRaw(svg: string) {
    const cached = SVG.svgNodesPool[svg];
    if (cached && (cached.size.x > 0 || cached.size.y > 0)) return cached;

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
      SVG.extractGroupNodes(svgRoot, svgRoot, rootTransform, {}),
    );
    const builder: RawSVG = {
      size,
      nodes,
    };
    SVG.svgNodesPool[svg] = builder;
    return builder;
  }

  private static getElementTransformation(
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

  private static getElementStyle(
    element: SVGGraphicsElement,
    inheritedStyle: ShapeProps,
  ): ShapeProps {
    return {
      fill: element.getAttribute('fill') ?? inheritedStyle.fill,
      stroke: element.getAttribute('stroke') ?? inheritedStyle.stroke,
      lineWidth: element.hasAttribute('stroke-width')
        ? parseFloat(element.getAttribute('stroke-width')!)
        : inheritedStyle.lineWidth,
      layout: false,
    };
  }

  private processElementStyle({fill, stroke, ...rest}: ShapeProps): ShapeProps {
    return {
      fill: fill === 'currentColor' ? this.fill : fill,
      stroke: stroke === 'currentColor' ? this.stroke : stroke,
      ...rest,
    };
  }

  protected static getMatrixTransformation(transform: DOMMatrix): ShapeProps {
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
    return {
      position,
      rotation,
      scale,
    };
  }

  private static *extractGroupNodes(
    element: SVGElement,
    svgRoot: Element,
    parentTransform: DOMMatrix,
    inheritedStyle: ShapeProps,
  ): Generator<RawSVGChild> {
    for (const child of element.children) {
      if (!(child instanceof SVGGraphicsElement)) continue;

      yield* this.extractElementNodes(
        child,
        svgRoot,
        parentTransform,
        inheritedStyle,
      );
    }
  }

  private static *extractElementNodes(
    child: SVGGraphicsElement,
    svgRoot: Element,
    parentTransform: DOMMatrix,
    inheritedStyle: ShapeProps,
  ): Generator<RawSVGChild> {
    const transformMatrix = SVG.getElementTransformation(
      child,
      parentTransform,
    );
    const style = SVG.getElementStyle(child, inheritedStyle);
    const id = child.id ?? '';
    if (child.tagName == 'g')
      yield* SVG.extractGroupNodes(child, svgRoot, transformMatrix, style);
    else if (child.tagName == 'use') {
      const hrefElement = svgRoot.querySelector(
        (child as SVGUseElement).href.baseVal,
      )!;
      if (!(hrefElement instanceof SVGGraphicsElement)) return;

      yield* SVG.extractElementNodes(
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
      });
      const bbox = path.getPathBBox();
      const center = bbox.center;
      const transformation = transformMatrix.translate(center.x, center.y);
      yield {
        id,
        type: Path,
        transformation,
        bbox,
        props: {
          data,
          ...SVG.getMatrixTransformation(transformation),
          ...style,
        } as PathProps,
      };
    } else if (child.tagName == 'rect') {
      const width = parseFloat(child.getAttribute('width') ?? '0');
      const height = parseFloat(child.getAttribute('height') ?? '0');

      const bbox = new BBox(0, 0, width, height);
      const center = bbox.center;
      const transformation = transformMatrix.translate(center.x, center.y);
      yield {
        id,
        type: Rect,
        bbox,
        transformation,
        props: {
          width,
          height,
          ...SVG.getMatrixTransformation(transformation),
          ...style,
        } as RectProps,
      };
    }
  }

  protected isNodeEqual(aNode: SVGChildNode, bNode: SVGChildNode): boolean {
    if (aNode.shape.constructor !== bNode.shape.constructor) return false;
    if (
      aNode.shape instanceof Path &&
      bNode.shape instanceof Path &&
      aNode.shape.data() !== bNode.shape.data()
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
          aNodes.slice(aIndex, aCommon).forEach(shape => {
            diff.deleted.push(shape);
          });
        if (bIndex !== bCommon) {
          bNodes.slice(bIndex, bCommon).forEach(shape => {
            diff.inserted.push({
              fromIndex: aCommon,
              node: shape,
            });
          });
        }

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

    if (aIndex !== aLength)
      aNodes.slice(aIndex).forEach(shape => {
        diff.deleted.push(shape);
      });

    if (bIndex !== bNodes.length)
      bNodes.slice(bIndex).forEach(shape => {
        diff.inserted.push({
          fromIndex: aLength,
          node: shape,
        });
      });

    diff.deleted = diff.deleted.filter(aNode => {
      const insertIndex = diff.inserted.findIndex(bNode =>
        this.isNodeEqual(aNode, bNode.node),
      );
      if (insertIndex >= 0) {
        const bNode = diff.inserted[insertIndex];

        diff.transformed.push({
          from: aNode,
          to: bNode.node,
        });

        diff.inserted.splice(insertIndex, 1);

        return false;
      }

      return true;
    });

    diff.inserted.forEach((value, index) => {
      value.fromIndex += index;
    });

    return diff;
  }

  private cloneNodeExact(node: Node, extraProps?: NodeProps) {
    const props: ShapeProps = {
      position: node.position(),
      scale: node.scale(),
      rotation: node.rotation(),
      ...extraProps,
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

    for (const {node, fromIndex} of diff.inserted)
      this.wrapper.insert(node.shape, fromIndex);

    const transformed = diff.transformed.map(({from, ...rest}) => ({
      from: {
        id: from.id,
        shape: this.cloneNodeExact(from.shape),
      },
      current: from,
      ...rest,
    }));

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
          const currentShape = node.current.shape;
          const fromShape = node.from.shape;
          const toShape = node.to.shape;
          currentShape.position(
            Vector2.lerp(fromShape.position(), toShape.position(), eased),
          );
          currentShape.scale(
            Vector2.lerp(fromShape.scale(), toShape.scale(), eased),
          );
          currentShape.rotation(
            easeInOutSine(remapped, fromShape.rotation(), toShape.rotation()),
          );

          if (currentShape instanceof Layout)
            currentShape.size(
              Vector2.lerp(
                (fromShape as Layout).size(),
                (toShape as Layout).size(),
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
        for (const {shape} of diff.deleted) shape.opacity(deletedOpacity);

        const insertedOpacity = clampRemap(ending - overlap, 1, 0, 1, progress);
        for (const {node} of diff.inserted) node.shape.opacity(insertedOpacity);
      },
      () => {
        this.wrapper.children(this.parsedNodes);
        if (autoWidth) this.customWidth(null);
        if (autoHeight) this.customHeight(null);

        for (const {shape} of diff.deleted) shape.dispose();
        for (const {from, current} of transformed) {
          from.shape.dispose();
          current.shape.dispose();
        }
      },
    );
  }
}
