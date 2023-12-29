import {
  BBox,
  Matrix2D,
  PossibleSpacing,
  SerializedVector2,
  SignalValue,
  SimpleSignal,
  ThreadGenerator,
  TimingFunction,
  Vector2,
  all,
  clampRemap,
  delay,
  easeInOutSine,
  isReactive,
  lazy,
  threadable,
  tween,
  useLogger,
} from '@motion-canvas/core';
import {computed, signal} from '../decorators';
import {DesiredLength, PossibleCanvasStyle} from '../partials';
import {applyTransformDiff, getTransformDiff} from '../utils/diff';
import {Circle, CircleProps} from './Circle';
import {Img, ImgProps} from './Img';
import {Layout} from './Layout';
import {Line, LineProps} from './Line';
import {Node, NodeProps} from './Node';
import {Path, PathProps} from './Path';
import {Rect, RectProps} from './Rect';
import {Shape, ShapeProps} from './Shape';
import {View2D} from './View2D';

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
  svg: SignalValue<string>;
}

/**
A Node for drawing and animating SVG images.

@remarks
If you're not interested in animating SVG, you can use {@link Img} instead.
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
    this.wrapper.scale(this.wrapperScale);
    this.add(this.wrapper);
  }

  /**
   * Get all SVG nodes with the given id.
   * @param id - An id to query.
   */
  public getChildrenById(id: string) {
    return this.document()
      .nodes.filter(node => node.id === id)
      .map(({shape}) => shape);
  }

  protected override desiredSize(): SerializedVector2<DesiredLength> {
    const docSize = this.document().size;
    const scale = this.calculateWrapperScale(
      docSize,
      super.desiredSize() as SerializedVector2<number | null>,
    );
    return docSize.mul(scale);
  }

  protected getCurrentSize() {
    return {
      x: this.width.isInitial() ? null : this.width(),
      y: this.height.isInitial() ? null : this.height(),
    };
  }

  protected calculateWrapperScale(
    documentSize: Vector2,
    parentSize: SerializedVector2<number | null>,
  ) {
    const result = new Vector2(1, 1);
    if (parentSize.x && parentSize.y) {
      result.x = parentSize.x / documentSize.width;
      result.y = parentSize.y / documentSize.height;
    } else if (parentSize.x && !parentSize.y) {
      result.x = parentSize.x / documentSize.width;
      result.y = result.x;
    } else if (!parentSize.x && parentSize.y) {
      result.y = parentSize.y / documentSize.height;
      result.x = result.y;
    }
    return result;
  }

  /**
   * Convert `SVGDocumentData` to `SVGDocument`.
   * @param data - `SVGDocumentData` to convert.
   */
  protected buildDocument(data: SVGDocumentData): SVGDocument {
    return {
      size: data.size,
      nodes: data.nodes.map(ch => this.buildShape(ch)),
    };
  }

  /**
   * Convert `SVGShapeData` to `SVGShape`.
   * @param data - `SVGShapeData` to convert.
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
   * Convert an SVG string to `SVGDocument`.
   * @param svg - An SVG string to be parsed.
   */
  protected parseSVG(svg: string): SVGDocument {
    return this.buildDocument(SVG.parseSVGData(svg));
  }

  /**
   * Create a tweening list to tween between two SVG nodes.
   * @param from - The initial node,
   * @param to - The final node.
   * @param duration - The duration of the tween.
   * @param timing - The timing function.
   */
  protected *generateTransformer(
    from: Node,
    to: Node,
    duration: number,
    timing: TimingFunction,
  ): Generator<ThreadGenerator> {
    yield from.position(to.position(), duration, timing);
    yield from.scale(to.scale(), duration, timing);
    yield from.rotation(to.rotation(), duration, timing);
    if (
      from instanceof Path &&
      to instanceof Path &&
      from.data() !== to.data()
    ) {
      yield from.data(to.data(), duration, timing);
    }
    if (from instanceof Layout && to instanceof Layout) {
      yield from.size(to.size(), duration, timing);
    }
    if (from instanceof Shape && to instanceof Shape) {
      yield from.fill(to.fill(), duration, timing);
      yield from.stroke(to.stroke(), duration, timing);
      yield from.lineWidth(to.lineWidth(), duration, timing);
    }

    const fromChildren = from.children();
    const toChildren = to.children();
    for (let i = 0; i < fromChildren.length; i++) {
      yield* this.generateTransformer(
        fromChildren[i],
        toChildren[i],
        duration,
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
    const newValue = isReactive(value) ? value() : value;
    const newSVG = this.parseSVG(newValue);
    const currentSVG = this.document();
    const diff = getTransformDiff(currentSVG.nodes, newSVG.nodes);

    this.lastTweenTargetSrc = newValue;
    this.lastTweenTargetDocument = newSVG;

    applyTransformDiff(currentSVG.nodes, diff, ({shape, ...rest}) => ({
      ...rest,
      shape: shape.clone(),
    }));
    this.wrapper.children(currentSVG.nodes.map(shape => shape.shape));
    for (const item of currentSVG.nodes) {
      item.shape.parent(this.wrapper);
    }

    const beginning = 0.2;
    const ending = 0.8;
    const overlap = 0.15;

    const transformator: ThreadGenerator[] = [];
    const transformatorTime = (ending - beginning) * time;
    const transformatorDelay = beginning * time;

    for (const item of diff.transformed) {
      transformator.push(
        ...this.generateTransformer(
          item.from.current.shape,
          item.to.current.shape,
          transformatorTime,
          timingFunction,
        ),
      );
    }

    const autoWidth = this.width.isInitial();
    const autoHeight = this.height.isInitial();
    this.wrapper.scale(
      this.calculateWrapperScale(currentSVG.size, this.getCurrentSize()),
    );

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
        this.wrapper.scale(this.wrapperScale);
      },
    );
    yield* all(
      this.wrapper.scale(
        this.calculateWrapperScale(newSVG.size, this.getCurrentSize()),
        time,
        timingFunction,
      ),
      baseTween,
      delay(transformatorDelay, all(...transformator)),
    );
  }

  @computed()
  private wrapperScale(): Vector2 {
    return this.calculateWrapperScale(
      this.document().size,
      this.getCurrentSize(),
    );
  }

  /**
   * Get the current `SVGDocument`.
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
   * Get current document nodes.
   */
  @computed()
  private documentNodes() {
    return this.document().nodes.map(node => node.shape);
  }

  /**
   * Convert SVG colors in Shape properties to Motion Canvas colors.
   * @param param - Shape properties.
   * @returns Converted Shape properties.
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
   * Parse an SVG string as `SVGDocumentData`.
   * @param svg - And SVG string to be parsed.
   * @returns `SVGDocumentData` that can be used to build SVGDocument.
   */
  protected static parseSVGData(svg: string) {
    const cached = SVG.svgNodesPool[svg];
    if (cached && (cached.size.x > 0 || cached.size.y > 0)) return cached;

    SVG.containerElement.innerHTML = svg;

    const svgRoot = SVG.containerElement.querySelector('svg');

    if (!svgRoot) {
      useLogger().error({
        message: 'Invalid SVG',
        object: svg,
      });
      return {
        size: new Vector2(0, 0),
        nodes: [],
      } as SVGDocumentData;
    }

    let viewBox = new BBox();
    let size = new Vector2();

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
    const matrix2 = new Matrix2D(transform);

    const position = matrix2.translation;
    const rotation = matrix2.rotation;
    // matrix.scaling can give incorrect result when matrix contain skew operation
    const scale = {
      x: matrix2.x.magnitude,
      y: matrix2.y.magnitude,
    };
    if (matrix2.determinant < 0) {
      if (matrix2.values[0] < matrix2.values[3]) scale.x = -scale.x;
      else scale.y = -scale.y;
    }
    return {
      position,
      rotation,
      scale,
    };
  }

  /**
   * Convert an SVG color into a Motion Canvas color.
   * @param color - SVG color.
   * @returns Motion Canvas color.
   */
  private static processSVGColor(
    color: SignalValue<PossibleCanvasStyle> | undefined,
  ): SignalValue<PossibleCanvasStyle> | undefined {
    if (color === 'transparent' || color === 'none') {
      return null;
    }

    return color;
  }

  /**
   * Get the final transformation matrix for the given SVG element.
   * @param element - SVG element.
   * @param parentTransform - The transformation matrix of the parent.
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

  private static parseLineCap(name: string | null): CanvasLineCap | null {
    if (!name) return null;
    if (name === 'butt' || name === 'round' || name === 'square') return name;

    useLogger().warn(`SVG: invalid line cap "${name}"`);
    return null;
  }

  private static parseLineJoin(name: string | null): CanvasLineJoin | null {
    if (!name) return null;
    if (name === 'bevel' || name === 'miter' || name === 'round') return name;

    if (name === 'arcs' || name === 'miter-clip') {
      useLogger().warn(`SVG: line join is not supported "${name}"`);
    } else {
      useLogger().warn(`SVG: invalid line join "${name}"`);
    }
    return null;
  }

  private static parseLineDash(value: string | null): number[] | null {
    if (!value) return null;

    const list = value.split(/,|\s+/);
    if (list.findIndex(str => str.endsWith('%')) > 0) {
      useLogger().warn(`SVG: percentage line dash are ignored`);
      return null;
    }
    return list.map(str => parseFloat(str));
  }

  private static parseDashOffset(value: string | null): number | null {
    if (!value) return null;
    const trimmed = value.trim();
    if (trimmed.endsWith('%')) {
      useLogger().warn(`SVG: percentage line dash offset are ignored`);
    }
    return parseFloat(trimmed);
  }

  private static parseOpacity(value: string | null): number | null {
    if (!value) return null;
    if (value.endsWith('%')) return parseFloat(value) / 100;
    return parseFloat(value);
  }

  /**
   * Convert the SVG element's style to a Motion Canvas Shape properties.
   * @param element - An SVG element whose style should be converted.
   * @param inheritedStyle - The parent style that should be inherited.
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
      lineCap:
        this.parseLineCap(element.getAttribute('stroke-linecap')) ??
        inheritedStyle.lineCap,
      lineJoin:
        this.parseLineJoin(element.getAttribute('stroke-linejoin')) ??
        inheritedStyle.lineJoin,
      lineDash:
        this.parseLineDash(element.getAttribute('stroke-dasharray')) ??
        inheritedStyle.lineDash,
      lineDashOffset:
        this.parseDashOffset(element.getAttribute('stroke-dashoffset')) ??
        inheritedStyle.lineDashOffset,
      opacity:
        this.parseOpacity(element.getAttribute('opacity')) ??
        inheritedStyle.opacity,
      layout: false,
    };
  }

  /**
   * Extract `SVGShapeData` list from the SVG element's children.
   * This will not extract the current element's shape.
   * @param element - An element whose children will be extracted.
   * @param svgRoot - The SVG root ("svg" tag) of the element.
   * @param parentTransform - The transformation matrix applied to the parent.
   * @param inheritedStyle - The style of the current SVG `element` that the children should inherit.
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
   * Parse a number from an SVG element attribute.
   * @param element - SVG element whose attribute will be parsed.
   * @param name - The name of the attribute to parse.
   * @returns a parsed number or `0` if the attribute is not defined.
   */
  private static parseNumberAttribute(
    element: SVGElement,
    name: string,
  ): number {
    return parseFloat(element.getAttribute(name) ?? '0');
  }

  /**
   * Extract `SVGShapeData` list from the SVG element.
   * This will also recursively extract shapes from its children.
   * @param child - An SVG element to extract.
   * @param svgRoot - The SVG root ("svg" tag) of the element.
   * @param parentTransform - The transformation matrix applied to the parent.
   * @param inheritedStyle - The style of the parent SVG element that the element should inherit.
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
