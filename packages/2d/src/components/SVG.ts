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
import {lazy, threadable} from '@motion-canvas/core/lib/decorators';
import {View2D} from './View2D';
import {all, delay} from '@motion-canvas/core/lib/flow';

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
  inserted: Array<SVGChildNode>;
  deleted: Array<SVGChildNode>;
  transformed: Array<{
    insert: boolean;
    from: SVGChildNode;
    to: SVGChildNode;
  }>;
}

interface TransformationInformation {
  current: Node;
  from: Node;
  to: Node;
  tweenPath: boolean;
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
      const bbox = path.getCurrentPathBBox();
      const center = bbox.center;
      const transformation = transformMatrix.translate(center.x, center.y);
      yield {
        id: id || 'path',
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
        id: id || 'rect',
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

  private getShapeMap(svg: ParsedSVG) {
    const map: Record<string, SVGChildNode[]> = {};
    for (const node of svg.nodes) {
      if (!map[node.id]) map[node.id] = [];

      map[node.id].push(node);
    }
    return map;
  }

  private diffSVG(from: ParsedSVG, to: ParsedSVG): SVGDiff {
    const diff: SVGDiff = {
      fromSize: from.size,
      toSize: to.size,
      inserted: [],
      deleted: [],
      transformed: [],
    };

    const fromMap = this.getShapeMap(from);
    const fromKeys = Object.keys(fromMap);
    const toMap = this.getShapeMap(to);
    const toKeys = Object.keys(toMap);

    while (fromKeys.length > 0) {
      const key = fromKeys.pop()!;
      const fromItem = fromMap[key];
      const toIndex = toKeys.indexOf(key);
      if (toIndex >= 0) {
        toKeys.splice(toIndex, 1);
        const toItem = toMap[key];

        for (let i = 0; i < Math.max(fromItem.length, toItem.length); i++) {
          const insert = i >= fromItem.length;

          const fromNode =
            i < fromItem.length ? fromItem[i] : fromItem[fromItem.length - 1];
          const toNode =
            i < toItem.length ? toItem[i] : toItem[toItem.length - 1];

          diff.transformed.push({
            insert,
            from: fromNode,
            to: toNode,
          });
        }
      } else {
        for (const node of fromItem) {
          diff.deleted.push(node);
        }
      }
    }

    if (toKeys.length > 0) {
      for (const key of toKeys) {
        for (const node of toMap[key]) {
          diff.inserted.push(node);
        }
      }
    }

    return diff;
  }

  private cloneNodeExact(node: Node) {
    const props: ShapeProps = {
      position: node.position(),
      scale: node.scale(),
      rotation: node.rotation(),
      children: node.children().map(child => this.cloneNodeExact(child)),
    };
    if (node instanceof Layout) {
      props.size = node.size();
    }
    return node.clone(props);
  }

  protected transformNode(
    currentShape: Node,
    fromShape: Node,
    toShape: Node,
    progress: number,
  ) {
    const eased = easeInOutSine(progress);
    currentShape.position(
      Vector2.lerp(fromShape.position(), toShape.position(), eased),
    );
    currentShape.scale(Vector2.lerp(fromShape.scale(), toShape.scale(), eased));
    currentShape.rotation(
      easeInOutSine(progress, fromShape.rotation(), toShape.rotation()),
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

  protected *extractTransformationInformation(
    current: Node,
    from: Node,
    to: Node,
  ): Generator<TransformationInformation> {
    yield {
      current,
      from,
      to,
      tweenPath:
        from instanceof Path && (from as Path).data() !== (to as Path).data(),
    };
    const currentChildren = current.children();
    const fromChildren = from.children();
    const toChildren = to.children();
    for (let i = 0; i < currentChildren.length; i++) {
      yield* this.extractTransformationInformation(
        currentChildren[i],
        fromChildren[i],
        toChildren[i],
      );
    }
  }

  protected getTransformationList(transformed: SVGDiff['transformed']) {
    const transformation: TransformationInformation[] = [];
    for (const {from, to} of transformed) {
      transformation.push(
        ...this.extractTransformationInformation(
          from.shape,
          this.cloneNodeExact(from.shape),
          to.shape,
        ),
      );
    }

    return transformation;
  }

  @threadable()
  protected *tweenSvg(
    value: SignalValue<string>,
    time: number,
    timingFunction: TimingFunction,
  ) {
    const newValue = typeof value == 'string' ? value : value();
    const newSVG = this.parseSVG(newValue);
    const ct = Date.now();
    const diff = this.diffSVG(this.parsed(), newSVG);
    useLogger().info(`diff time ${(Date.now() - ct) / 1000}`);

    for (const node of diff.inserted) this.wrapper.insert(node.shape);

    for (const node of diff.transformed) {
      if (!node.insert) continue;
      node.from = {
        id: node.from.id,
        shape: this.cloneNodeExact(node.from.shape),
      };
      this.wrapper.insert(node.from.shape);
    }

    const transformed = this.getTransformationList(diff.transformed);

    const autoWidth = this.customWidth() == null;
    const autoHeight = this.customHeight() == null;

    const beginning = 0.2;
    const ending = 0.8;
    const overlap = 0.15;

    const pathTweenTime = 0.6 * time;
    const pathTweenDelay = 0.2 * time;
    const pathTweens = transformed
      .filter(information => information.tweenPath)
      .map(({current, to}) =>
        (current as Path).data(
          (to as Path).data,
          pathTweenTime,
          timingFunction,
        ),
      );

    const baseTween = tween(
      time,
      value => {
        const progress = timingFunction(value);
        const remapped = clampRemap(beginning, ending, 0, 1, progress);

        for (const node of transformed) {
          this.transformNode(node.current, node.from, node.to, remapped);
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
        for (const {shape} of diff.inserted) shape.opacity(insertedOpacity);
      },
      () => {
        this.wrapper.children(this.parsedNodes);
        if (autoWidth) this.customWidth(null);
        if (autoHeight) this.customHeight(null);

        for (const {shape} of diff.deleted) shape.dispose();
        for (const {from, current} of transformed) {
          from.dispose();
          current.dispose();
        }
      },
    );
    yield* all(baseTween, delay(pathTweenDelay, all(...pathTweens)));
  }
}
