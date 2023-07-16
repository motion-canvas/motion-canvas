import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';
import {
  BBox,
  PossibleSpacing,
  SerializedVector2,
  Vector2,
} from '@motion-canvas/core/lib/types';
import {computed, signal} from '../decorators';
import {Shape, ShapeProps} from './Shape';
import {Node, NodeProps} from './Node';
import {DesiredLength, PossibleCanvasStyle} from '../partials';
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
import {ThreadGenerator} from '@motion-canvas/core/lib/threading';
import {Circle, CircleProps} from './Circle';
import {Line, LineProps} from './Line';
import {Img, ImgProps} from './Img';
import {applyTransformDiff, getTransformDiff} from '../utils/diff';

/**
 * Represent SVG shape.
 * This only used single time because `node` may have reference to parent SVG renderer.
 */
export interface SVGShape {
  id: string;
  shape: Node;
}

/**
 * Data of SVGShape.
 * This can used many times  because it do not reference parent SVG.
 * This must build into SVGShape
 */
export interface SVGShapeData {
  id: string;
  type: new (props: NodeProps) => Node;
  props: ShapeProps;
  children?: SVGShapeData[];
}

/**
 * Represent SVG document that contains SVG shapes.
 * This only used single time because `nodes` have reference to parent SVG renderer.
 */
export interface SVGDocument {
  size: Vector2;
  nodes: SVGShape[];
}

/**
 * Data of SVGDocument.
 * This can used many times because it do not reference parent SVG.
 * This must build into SVGDocument
 */
export interface SVGDocumentData {
  size: Vector2;
  nodes: SVGShapeData[];
}

export interface SVGProps extends ShapeProps {
  svg?: SignalValue<string>;
}

/**
 * Node to render and animating SVG.
 * You should use Image node if you do not want to animate children.
 */
export class SVG extends Shape {
  @lazy(() => {
    const element = document.createElement('div');
    View2D.shadowRoot.appendChild(element);
    return element;
  })
  protected static containerElement: HTMLDivElement;
  private static svgNodesPool: Record<string, SVGDocumentData> = {};

  /**
   * SVG string to be rendered
   */
  @signal()
  public declare readonly svg: SimpleSignal<string, this>;

  /**
   * Child to wrap all SVG node
   */
  public wrapper: Node;

  private lastTweenTargetSrc: string | null = null;
  private lastTweenTargetDocument: SVGDocument | null = null;

  public constructor(props: SVGProps) {
    super(props);
    this.wrapper = new Node({});
    this.wrapper.children(this.documentNodes);
    this.add(this.wrapper);
  }

  /**
   * Get SVG node by id.
   * @param id - id
   * @returns list of Node that have matched id
   */
  public getChildrenById(id: string) {
    return this.document()
      .nodes.filter(node => node.id === id)
      .map(({shape}) => shape);
  }

  protected override desiredSize(): SerializedVector2<DesiredLength> {
    const custom = super.desiredSize();
    const {x, y} = this.document().size.mul(this.wrapper.scale());
    return {
      x: custom.x ?? x,
      y: custom.y ?? y,
    };
  }

  /**
   * Convert SVGDocumentData into SVGDocument
   * @param data - SVGDocumentData
   * @returns SVGDocument
   */
  protected buildDocument(data: SVGDocumentData): SVGDocument {
    return {
      size: data.size,
      nodes: data.nodes.map(ch => this.buildShape(ch)),
    };
  }

  /**
   * Build SVGShapeData into SVGShape
   * @param data - SVGShapeData
   * @returns SVGShape
   */
  protected buildShape({id, type, props, children}: SVGShapeData): SVGShape {
    return {
      id,
      shape: new type({
        children: children?.map(ch => this.buildShape(ch).shape),
        ...this.processElementStyle(props),
      }),
    };
  }

  /**
   * Parse SVG as SVGDocument
   * @param svg - svg string to be parsed
   * @returns - SVGDocument
   */
  protected parseSVG(svg: string): SVGDocument {
    return this.buildDocument(SVG.parseSVGData(svg));
  }

  /**
   * Create tweening list to tween node from initial node to final node.
   * @param from - Initial node
   * @param to - Final node
   * @param time - time for tweening
   * @param timing - timing for tweening
   */
  protected *generateTransformator(
    from: Node,
    to: Node,
    time: number,
    timing: TimingFunction,
  ): Generator<ThreadGenerator> {
    yield from.position(to.position(), time, timing);
    yield from.scale(to.scale(), time, timing);
    yield from.rotation(to.rotation(), time, timing);
    if (
      from instanceof Path &&
      to instanceof Path &&
      from.data() !== to.data()
    ) {
      yield from.data(to.data(), time, timing);
    }
    if (from instanceof Layout && to instanceof Layout) {
      yield from.size(to.size(), time, timing);
    }
    if (from instanceof Shape && to instanceof Shape) {
      yield from.fill(to.fill(), time, timing);
      yield from.stroke(to.stroke(), time, timing);
      yield from.lineWidth(to.lineWidth(), time, timing);
    }

    const fromChildren = from.children();
    const toChildren = to.children();
    for (let i = 0; i < fromChildren.length; i++) {
      yield* this.generateTransformator(
        fromChildren[i],
        toChildren[i],
        time,
        timing,
      );
    }
  }

  @threadable()
  protected *tweenSvg(
    value: SignalValue<string>,
    time: number,
    timingFunction: TimingFunction,
  ) {
    const newValue = typeof value === 'string' ? value : value();
    const newSVG = this.parseSVG(newValue);
    const currentSVG = this.document();
    const diff = getTransformDiff(currentSVG.nodes, newSVG.nodes);

    this.lastTweenTargetSrc = newValue;
    this.lastTweenTargetDocument = newSVG;

    const applyResult = applyTransformDiff(
      currentSVG.nodes,
      diff,
      ({shape, ...rest}) => ({
        ...rest,
        shape: shape.clone(),
      }),
    );
    this.wrapper.children(currentSVG.nodes.map(shape => shape.shape));
    for (const {item} of applyResult.inserted) {
      item.current.shape.parent(this.wrapper);
    }

    const beginning = 0.2;
    const ending = 0.8;
    const overlap = 0.15;

    const transformator: ThreadGenerator[] = [];
    const transformatorTime = (ending - beginning) * time;
    const transformatorDelay = beginning * time;

    for (const item of diff.transformed) {
      transformator.push(
        ...this.generateTransformator(
          item.from.current.shape,
          item.to.current.shape,
          transformatorTime,
          timingFunction,
        ),
      );
    }

    const autoWidth = this.width.isInitial();
    const autoHeight = this.height.isInitial();

    const baseTween = tween(
      time,
      value => {
        const progress = timingFunction(value);
        const remapped = clampRemap(beginning, ending, 0, 1, progress);

        const scale = this.wrapper.scale();
        if (autoWidth) {
          this.width(
            easeInOutSine(remapped, currentSVG.size.x, newSVG.size.x) * scale.x,
          );
        }

        if (autoHeight) {
          this.height(
            easeInOutSine(remapped, currentSVG.size.y, newSVG.size.y) * scale.y,
          );
        }

        const deletedOpacity = clampRemap(
          0,
          beginning + overlap,
          1,
          0,
          progress,
        );
        for (const {current} of diff.deleted) {
          current.shape.opacity(deletedOpacity);
        }

        const insertedOpacity = clampRemap(ending - overlap, 1, 0, 1, progress);
        for (const {current} of diff.inserted) {
          current.shape.opacity(insertedOpacity);
        }
      },
      () => {
        this.wrapper.children(this.documentNodes);
        if (autoWidth) this.width.reset();
        if (autoHeight) this.height.reset();

        for (const {current} of diff.deleted) current.shape.dispose();
        for (const {from} of diff.transformed) {
          from.current.shape.dispose();
        }
      },
    );
    yield* all(baseTween, delay(transformatorDelay, all(...transformator)));
  }

  /**
   * Get current SVGDocument
   * @returns
   */
  @computed()
  private document(): SVGDocument {
    try {
      const src = this.svg();
      if (this.lastTweenTargetDocument && src === this.lastTweenTargetSrc) {
        return this.lastTweenTargetDocument;
      }
      return this.parseSVG(src);
    } finally {
      this.lastTweenTargetSrc = null;
      this.lastTweenTargetDocument = null;
    }
  }

  /**
   * Get current document nodes
   */
  @computed()
  private documentNodes() {
    return this.document().nodes.map(node => node.shape);
  }

  /**
   * Convert SVG color in Shape properties into MotionCanvas color.
   * @param param - Shape properties
   * @returns Converted Shape properties
   */
  private processElementStyle({fill, stroke, ...rest}: ShapeProps): ShapeProps {
    return {
      fill: fill === 'currentColor' ? this.fill : SVG.processSVGColor(fill),
      stroke:
        stroke === 'currentColor' ? this.stroke : SVG.processSVGColor(stroke),
      ...rest,
    };
  }

  /**
   * Parse SVG as SVGDocumentData
   * @param svg - svg string to be parsed
   * @returns SVGDocumentData that can be used to build SVGDocument
   */

  protected static parseSVGData(svg: string) {
    const cached = SVG.svgNodesPool[svg];
    if (cached && (cached.size.x > 0 || cached.size.y > 0)) return cached;

    SVG.containerElement.innerHTML = svg;

    const svgRoot = SVG.containerElement.querySelector('svg')!;
    let viewBox: BBox = new BBox();
    let size: Vector2 = new Vector2();

    const hasViewBox = svgRoot.hasAttribute('viewBox');
    const hasSize =
      svgRoot.hasAttribute('width') || svgRoot.hasAttribute('height');

    if (hasViewBox) {
      const {x, y, width, height} = svgRoot.viewBox.baseVal;
      viewBox = new BBox(x, y, width, height);

      if (!hasSize) size = viewBox.size;
    }

    if (hasSize) {
      size = new Vector2(
        svgRoot.width.baseVal.value,
        svgRoot.height.baseVal.value,
      );

      if (!hasViewBox) viewBox = new BBox(0, 0, size.width, size.height);
    }

    if (!hasViewBox && !hasSize) {
      viewBox = new BBox(svgRoot.getBBox());
      size = viewBox.size;
    }

    const scale = size.div(viewBox.size);
    const center = viewBox.center;

    const rootTransform = new DOMMatrix()
      .scaleSelf(scale.x, scale.y)
      .translateSelf(-center.x, -center.y);

    const nodes = Array.from(
      SVG.extractGroupNodes(svgRoot, svgRoot, rootTransform, {}),
    );
    const builder: SVGDocumentData = {
      size,
      nodes,
    };
    SVG.svgNodesPool[svg] = builder;
    return builder;
  }

  /**
   * Get position, rotation and scale from Matrix transformation as Shape properties
   * @param transform - Matrix transformation
   * @returns MotionCanvas Shape properties
   */
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

  /**
   * Convert SVG color into MotionCanvas color
   * @param color - SVG color
   * @returns MotionCanvas color
   */
  private static processSVGColor(
    color: SignalValue<PossibleCanvasStyle> | undefined,
  ): SignalValue<PossibleCanvasStyle> | undefined {
    if (color === 'transparent' || color === 'none') {
      return {
        r: 0,
        g: 0,
        b: 0,
        a: 0,
      };
    }

    return color;
  }

  /**
   * Get final SVG element transformation.
   * @param element - SVG element
   * @param parentTransform - Tranformation that applied into children
   * @returns - Current SVG element final transformation
   */
  private static getElementTransformation(
    element: SVGGraphicsElement,
    parentTransform: DOMMatrix,
  ) {
    const transform = element.transform.baseVal.consolidate();
    const transformMatrix = (
      transform ? parentTransform.multiply(transform.matrix) : parentTransform
    ).translate(
      SVG.parseNumberAttribute(element, 'x'),
      SVG.parseNumberAttribute(element, 'y'),
    );
    return transformMatrix;
  }

  /**
   * Convert SVG style into MotionCanvas Shape
   * @param element - SVG element
   * @param inheritedStyle - Parent style that must inherited to this element
   * @returns - MotionCanvas Shape properties
   */
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

  /**
   * Extract SVGShapeData list from SVG element children.
   * This will not extract current element shape.
   * @param element - Element to be extracted
   * @param svgRoot - SVG root ("svg" tag) of element
   * @param parentTransform - Matrix transformation applied to parent
   * @param inheritedStyle - style of current SVG `element` that must inherited to its children
   */

  private static *extractGroupNodes(
    element: SVGElement,
    svgRoot: Element,
    parentTransform: DOMMatrix,
    inheritedStyle: ShapeProps,
  ): Generator<SVGShapeData> {
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

  /**
   * Parse number from SVG element attribute
   * @param element - SVG element whoose element will be parsed
   * @param name - attribute name to be parse
   * @returns  parsed number or 0 if attribute is not defined
   */

  private static parseNumberAttribute(
    element: SVGElement,
    name: string,
  ): number {
    return parseFloat(element.getAttribute(name) ?? '0');
  }

  /**
   * Extract SVGShapeData list from SVG element. This also will extract shape from children.
   * @param child - SVG element to extract
   * @param svgRoot - SVG root ("svg" tag) of element
   * @param parentTransform - Matrix transformation applied to parent
   * @param inheritedStyle - parent style that must inherited into current shape style
   */

  private static *extractElementNodes(
    child: SVGGraphicsElement,
    svgRoot: Element,
    parentTransform: DOMMatrix,
    inheritedStyle: ShapeProps,
  ): Generator<SVGShapeData> {
    const transformMatrix = SVG.getElementTransformation(
      child,
      parentTransform,
    );
    const style = SVG.getElementStyle(child, inheritedStyle);
    const id = child.id ?? '';
    if (child.tagName === 'g') {
      yield* SVG.extractGroupNodes(child, svgRoot, transformMatrix, style);
    } else if (child.tagName === 'use') {
      const hrefElement = svgRoot.querySelector(
        (child as SVGUseElement).href.baseVal,
      );
      if (!(hrefElement instanceof SVGGraphicsElement)) {
        useLogger().warn(`invalid SVG use tag. element "${child.outerHTML}"`);
        return;
      }

      yield* SVG.extractElementNodes(
        hrefElement,
        svgRoot,
        transformMatrix,
        inheritedStyle,
      );
    } else if (child.tagName === 'path') {
      const data = child.getAttribute('d');
      if (!data) {
        useLogger().warn('blank path data at ' + child.id);
        return;
      }
      const transformation = transformMatrix;
      yield {
        id: id || 'path',
        type: Path as unknown as new (props: NodeProps) => Node,
        props: {
          data,
          tweenAlignPath: true,
          ...SVG.getMatrixTransformation(transformation),
          ...style,
        } as PathProps,
      };
    } else if (child.tagName === 'rect') {
      const width = SVG.parseNumberAttribute(child, 'width');
      const height = SVG.parseNumberAttribute(child, 'height');
      const rx = SVG.parseNumberAttribute(child, 'rx');
      const ry = SVG.parseNumberAttribute(child, 'ry');

      const bbox = new BBox(0, 0, width, height);
      const center = bbox.center;
      const transformation = transformMatrix.translate(center.x, center.y);

      yield {
        id: id || 'rect',
        type: Rect,
        props: {
          width,
          height,
          radius: [rx, ry],
          ...SVG.getMatrixTransformation(transformation),
          ...style,
        } as RectProps,
      };
    } else if (['circle', 'ellipse'].includes(child.tagName)) {
      const cx = SVG.parseNumberAttribute(child, 'cx');
      const cy = SVG.parseNumberAttribute(child, 'cy');
      const size: PossibleSpacing =
        child.tagName === 'circle'
          ? SVG.parseNumberAttribute(child, 'r') * 2
          : [
              SVG.parseNumberAttribute(child, 'rx') * 2,
              SVG.parseNumberAttribute(child, 'ry') * 2,
            ];

      const transformation = transformMatrix.translate(cx, cy);

      yield {
        id: id || child.tagName,
        type: Circle,
        props: {
          size,
          ...style,
          ...SVG.getMatrixTransformation(transformation),
        } as CircleProps,
      };
    } else if (['line', 'polyline', 'polygon'].includes(child.tagName)) {
      const numbers =
        child.tagName === 'line'
          ? ['x1', 'y1', 'x2', 'y2'].map(attr =>
              SVG.parseNumberAttribute(child, attr),
            )
          : child
              .getAttribute('points')!
              .match(/-?[\d.e+-]+/g)!
              .map(value => parseFloat(value));
      const points = numbers.reduce<number[][]>((accum, current) => {
        let last = accum.at(-1);
        if (!last || last.length === 2) {
          last = [];
          accum.push(last);
        }
        last.push(current);
        return accum;
      }, []);

      if (child.tagName === 'polygon') points.push(points[0]);

      yield {
        id: id || child.tagName,
        type: Line as unknown as new (props: NodeProps) => Node,
        props: {
          points,
          ...style,
          ...SVG.getMatrixTransformation(transformMatrix),
        } as LineProps,
      };
    } else if (child.tagName === 'image') {
      const x = SVG.parseNumberAttribute(child, 'x');
      const y = SVG.parseNumberAttribute(child, 'y');
      const width = SVG.parseNumberAttribute(child, 'width');
      const height = SVG.parseNumberAttribute(child, 'height');
      const href = child.getAttribute('href') ?? '';

      const bbox = new BBox(x, y, width, height);
      const center = bbox.center;
      const transformation = transformMatrix.translate(center.x, center.y);

      yield {
        id: id || child.tagName,
        type: Img,
        props: {
          src: href,
          ...style,
          ...SVG.getMatrixTransformation(transformation),
        } as ImgProps,
      };
    }
  }
}
