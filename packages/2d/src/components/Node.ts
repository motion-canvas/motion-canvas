import {
  cloneable,
  ColorProperty,
  colorProperty,
  computed,
  getPropertiesOf,
  initial,
  initialize,
  Property,
  property,
  Vector2Property,
  vector2Property,
  wrapper,
} from '../decorators';
import {
  Vector2,
  Rect,
  transformScalar,
  PossibleColor,
  transformAngle,
  PossibleVector2,
} from '@motion-canvas/core/lib/types';
import {
  consumePromises,
  createSignal,
  isReactive,
  Reference,
  Signal,
  SignalValue,
} from '@motion-canvas/core/lib/utils';
import {ComponentChild, ComponentChildren, NodeConstructor} from './types';
import {Promisable} from '@motion-canvas/core/lib/threading';
import {useScene2D} from '../scenes';
import {TimingFunction} from '@motion-canvas/core/lib/tweening';
import {threadable} from '@motion-canvas/core/lib/decorators';
import {drawLine} from '../utils';
import type {View2D} from './View2D';

export interface NodeProps {
  ref?: Reference<any>;
  children?: ComponentChildren;
  key?: string;

  x?: SignalValue<number>;
  y?: SignalValue<number>;
  position?: SignalValue<PossibleVector2>;
  rotation?: SignalValue<number>;
  scaleX?: SignalValue<number>;
  scaleY?: SignalValue<number>;
  scale?: SignalValue<PossibleVector2>;

  opacity?: SignalValue<number>;
  blur?: SignalValue<number>;
  brightness?: SignalValue<number>;
  contrast?: SignalValue<number>;
  grayscale?: SignalValue<number>;
  hue?: SignalValue<number>;
  invert?: SignalValue<number>;
  saturate?: SignalValue<number>;
  sepia?: SignalValue<number>;
  shadowColor?: SignalValue<PossibleColor>;
  shadowBlur?: SignalValue<number>;
  shadowOffsetX?: SignalValue<number>;
  shadowOffsetY?: SignalValue<number>;
  shadowOffset?: SignalValue<PossibleVector2>;
  cache?: SignalValue<boolean>;
  composite?: SignalValue<boolean>;
  compositeOperation?: SignalValue<GlobalCompositeOperation>;
}

export class Node implements Promisable<Node> {
  public declare isClass: boolean;

  @vector2Property()
  public declare readonly position: Vector2Property<this>;

  @wrapper(Vector2)
  @cloneable(false)
  @property()
  public declare readonly absolutePosition: Property<
    PossibleVector2,
    Vector2,
    this
  >;

  protected getAbsolutePosition(): Vector2 {
    const matrix = this.localToWorld();
    return new Vector2(matrix.m41, matrix.m42);
  }

  protected setAbsolutePosition(value: SignalValue<Vector2>) {
    if (isReactive(value)) {
      this.position(() => value().transformAsPoint(this.worldToParent()));
    } else {
      this.position(value.transformAsPoint(this.worldToParent()));
    }
  }

  @initial(0)
  @property()
  public declare readonly rotation: Signal<number, this>;

  @cloneable(false)
  @property()
  public declare readonly absoluteRotation: Signal<number, this>;

  protected getAbsoluteRotation() {
    const matrix = this.localToWorld();
    return (Math.atan2(matrix.m12, matrix.m11) * 180) / Math.PI;
  }

  protected setAbsoluteRotation(value: SignalValue<number>) {
    if (isReactive(value)) {
      this.rotation(() => transformAngle(value(), this.worldToParent()));
    } else {
      this.rotation(transformAngle(value, this.worldToParent()));
    }
  }

  @initial(Vector2.one)
  @vector2Property('scale')
  public declare readonly scale: Vector2Property<this>;

  @wrapper(Vector2)
  @cloneable(false)
  @property()
  public declare readonly absoluteScale: Property<
    PossibleVector2,
    Vector2,
    this
  >;

  protected getAbsoluteScale(): Vector2 {
    const matrix = this.localToWorld();
    return new Vector2(
      Vector2.magnitude(matrix.m11, matrix.m12),
      Vector2.magnitude(matrix.m21, matrix.m22),
    );
  }

  protected setAbsoluteScale(value: SignalValue<Vector2>) {
    if (isReactive(value)) {
      this.scale(() => this.getRelativeScale(value()));
    } else {
      this.scale(this.getRelativeScale(value));
    }
  }

  private getRelativeScale(scale: Vector2): Vector2 {
    const parentScale = this.parent()?.absoluteScale() ?? Vector2.one;
    return scale.div(parentScale);
  }

  @initial(false)
  @property()
  public declare readonly cache: Signal<boolean, this>;

  @initial(false)
  @property()
  public declare readonly composite: Signal<boolean, this>;

  @initial('source-over')
  @property()
  public declare readonly compositeOperation: Signal<
    GlobalCompositeOperation,
    this
  >;

  private readonly compositeOverride = createSignal(0);

  @threadable()
  protected *tweenCompositeOperation(
    value: SignalValue<GlobalCompositeOperation>,
    time: number,
    timingFunction: TimingFunction,
  ) {
    const nextValue = isReactive(value) ? value() : value;
    if (nextValue === 'source-over') {
      yield* this.compositeOverride(1, time, timingFunction);
      this.compositeOverride(0);
      this.compositeOperation(nextValue);
    } else {
      this.compositeOperation(nextValue);
      this.compositeOverride(1);
      yield* this.compositeOverride(0, time, timingFunction);
    }
  }

  @initial(1)
  @property()
  public declare readonly opacity: Signal<number, this>;

  @computed()
  public absoluteOpacity(): number {
    return (this.parent()?.absoluteOpacity() ?? 1) * this.opacity();
  }

  @initial(0)
  @property()
  public declare readonly blur: Signal<number, this>;

  @initial(1)
  @property()
  public declare readonly brightness: Signal<number, this>;

  @initial(1)
  @property()
  public declare readonly contrast: Signal<number, this>;

  @initial(0)
  @property()
  public declare readonly grayscale: Signal<number, this>;

  @initial(0)
  @property()
  public declare readonly hue: Signal<number, this>;

  @initial(0)
  @property()
  public declare readonly invert: Signal<number, this>;

  @initial(1)
  @property()
  public declare readonly saturate: Signal<number, this>;

  @initial(0)
  @property()
  public declare readonly sepia: Signal<number, this>;

  @initial('#0000')
  @colorProperty()
  public declare readonly shadowColor: ColorProperty<this>;

  @initial(0)
  @property()
  public declare readonly shadowBlur: Signal<number, this>;

  @vector2Property('shadowOffset')
  public declare readonly shadowOffset: Vector2Property<this>;

  @computed()
  protected hasFilters() {
    return (
      this.blur() !== 0 ||
      this.brightness() !== 1 ||
      this.contrast() !== 1 ||
      this.grayscale() !== 0 ||
      this.hue() !== 0 ||
      this.invert() !== 0 ||
      this.saturate() !== 1 ||
      this.sepia() !== 0
    );
  }

  @computed()
  protected hasShadow() {
    return (
      !!this.shadowColor() &&
      (this.shadowBlur() > 0 ||
        this.shadowOffset.x() !== 0 ||
        this.shadowOffset.y() !== 0)
    );
  }

  @computed()
  protected filterString(): string {
    let filters = '';

    const invert = this.invert();
    if (invert !== 0) {
      filters += ` invert(${invert * 100}%)`;
    }
    const sepia = this.sepia();
    if (sepia !== 0) {
      filters += ` sepia(${sepia * 100}%)`;
    }
    const brightness = this.brightness();
    if (brightness !== 1) {
      filters += ` brightness(${brightness * 100}%)`;
    }
    const contrast = this.contrast();
    if (contrast !== 1) {
      filters += ` contrast(${contrast * 100}%)`;
    }
    const grayscale = this.grayscale();
    if (grayscale !== 0) {
      filters += ` grayscale(${grayscale * 100}%)`;
    }
    const hue = this.hue();
    if (hue !== 0) {
      filters += ` hue-rotate(${hue}deg)`;
    }
    const saturate = this.saturate();
    if (saturate !== 1) {
      filters += ` saturate(${saturate * 100}%)`;
    }
    const blur = this.blur();
    if (blur !== 0) {
      filters += ` blur(${transformScalar(blur, this.compositeToWorld())}px)`;
    }

    return filters;
  }

  public readonly children = createSignal<Node[]>([]);
  public readonly parent = createSignal<Node | null>(null);
  public readonly properties = getPropertiesOf(this);
  public readonly key: string;

  public constructor({children, key, ...rest}: NodeProps) {
    this.key = useScene2D()?.registerNode(this, key) ?? key ?? '';
    initialize(this, {defaults: rest});
    for (const {signal} of this) {
      signal.reset();
    }
    this.add(children);
  }

  @computed()
  public localToWorld(): DOMMatrix {
    const parent = this.parent();
    return parent
      ? parent.localToWorld().multiply(this.localToParent())
      : this.localToParent();
  }

  @computed()
  public worldToLocal() {
    return this.localToWorld().inverse();
  }

  @computed()
  public worldToParent(): DOMMatrix {
    return this.parent()?.worldToLocal() ?? new DOMMatrix();
  }

  @computed()
  public localToParent(): DOMMatrix {
    const matrix = new DOMMatrix();
    matrix.translateSelf(this.position.x(), this.position.y());
    matrix.rotateSelf(0, 0, this.rotation());
    matrix.scaleSelf(this.scale.x(), this.scale.y());
    const offset = this.getCustomOffset();
    matrix.translateSelf(offset.x, offset.y);

    return matrix;
  }

  @computed()
  protected cacheMatrix(): DOMMatrix {
    const parent = this.parent()?.cacheMatrix() ?? new DOMMatrix();
    const requiresCache = this.requiresCache();

    return requiresCache ? parent.multiply(this.worldToLocal()) : parent;
  }

  @computed()
  protected compositeMatrix(): DOMMatrix {
    const requiresCache = this.requiresCache();

    if (this.composite()) {
      const parent = this.parent()?.cacheMatrix() ?? new DOMMatrix();
      return requiresCache ? parent : parent.multiply(this.localToWorld());
    }

    const parent = this.parent()?.compositeMatrix() ?? new DOMMatrix();
    return requiresCache ? parent.multiply(this.worldToLocal()) : parent;
  }

  /**
   * A matrix mapping composite space to world space.
   *
   * @remarks
   * Certain effects such as blur and shadows ignore the current transformation.
   * This matrix can be used to transform their parameters so that the effect
   * appears relative to the closes composite root.
   */
  @computed()
  public compositeToWorld() {
    if (this.composite()) {
      const parent = this.parent()?.cacheMatrix() ?? new DOMMatrix();
      return parent.multiply(this.localToWorld());
    }

    return this.parent()?.compositeMatrix() ?? new DOMMatrix();
  }

  @computed()
  protected compositeRoot(): Node | null {
    if (this.composite()) {
      return this;
    }

    return this.parent()?.compositeRoot() ?? null;
  }

  @computed()
  public compositeToLocal() {
    const root = this.compositeRoot();
    if (root) {
      const worldToLocal = this.worldToLocal();
      worldToLocal.m44 = 1;
      return root.localToWorld().multiply();
    }
    return new DOMMatrix();
  }

  /**
   * Get the custom offset for this node's children.
   */
  protected getCustomOffset(): Vector2 {
    return Vector2.zero;
  }

  @computed()
  public view(): View2D | null {
    return this.parent()?.view() ?? null;
  }

  public add(node: ComponentChildren): this {
    return this.insert(node, Infinity);
  }

  public insert(node: ComponentChildren, index = 0): this {
    const array: ComponentChild[] = Array.isArray(node) ? node : [node];
    const children = this.children();
    const newChildren = children.slice(0, index);

    for (const node of array) {
      if (node instanceof Node) {
        newChildren.push(node);
        node.parent(this);
      }
    }

    newChildren.push(...children.slice(index));
    this.children(newChildren);

    return this;
  }

  public remove(): this {
    const current = this.parent();
    if (current === null) {
      return this;
    }

    current.children(current.children().filter(child => child !== this));
    this.parent(null);
    return this;
  }

  public move(by = 1): this {
    const parent = this.parent();
    if (by === 0 || !parent) {
      return this;
    }

    const children = parent.children();
    const newChildren: Node[] = [];

    if (by > 0) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child === this) {
          const target = i + by;
          for (; i < target && i + 1 < children.length; i++) {
            newChildren[i] = children[i + 1];
          }
        }
        newChildren[i] = child;
      }
    } else {
      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        if (child === this) {
          const target = i + by;
          for (; i > target && i > 0; i--) {
            newChildren[i] = children[i - 1];
          }
        }
        newChildren[i] = child;
      }
    }

    parent.children(newChildren);

    return this;
  }

  public moveUp(): this {
    return this.move(1);
  }

  public moveDown(): this {
    return this.move(-1);
  }

  public moveToTop(): this {
    return this.move(Infinity);
  }

  public moveToBottom(): this {
    return this.move(-Infinity);
  }

  protected moveTo(parent: Node): this {
    const current = this.parent();
    if (current === parent) {
      return this;
    }

    parent.children([...parent.children(), this]);
    this.parent(parent);

    return this;
  }

  public removeChildren() {
    for (const node of this.children()) {
      node.remove();
    }
  }

  public dispose() {
    // do nothing
  }

  /**
   * Create a copy of this node.
   *
   * @param customProps - Properties to override.
   */
  public clone(customProps: NodeProps = {}): this {
    const props: NodeProps & Record<string, any> = {...customProps};
    if (this.children().length > 0) {
      props.children ??= this.children().map(child => child.clone());
    }

    for (const {key, meta, signal} of this) {
      if (!meta.cloneable || key in props) continue;
      if (meta.compound) {
        for (const [key, property] of meta.compoundEntries) {
          props[property] = (<Record<string, Signal<any>>>(<unknown>signal))[
            key
          ].raw();
        }
      } else {
        props[key] = signal.raw();
      }
    }

    return this.instantiate(props);
  }

  /**
   * Create a copy of this node.
   *
   * @remarks
   * Unlike {@link clone}, a snapshot clone calculates any reactive properties
   * at the moment of cloning and passes the raw values to the copy.
   *
   * @param customProps - Properties to override.
   */
  public snapshotClone(customProps: NodeProps = {}): this {
    const props: NodeProps & Record<string, any> = {...customProps};
    if (this.children().length > 0) {
      props.children ??= this.children().map(child => child.snapshotClone());
    }

    for (const {key, meta, signal} of this) {
      if (!meta.cloneable || key in props) continue;
      props[key] = signal();
    }

    return this.instantiate(props);
  }

  /**
   * Create a reactive copy of this node.
   *
   * @remarks
   * A reactive copy has all its properties dynamically updated to match the
   * source node.
   *
   * @param customProps - Properties to override.
   */
  public reactiveClone(customProps: NodeProps = {}): this {
    const props: NodeProps & Record<string, any> = {...customProps};
    if (this.children().length > 0) {
      props.children ??= this.children().map(child => child.reactiveClone());
    }

    for (const {key, meta, signal} of this) {
      if (!meta.cloneable || key in props) continue;
      props[key] = () => signal();
    }

    return this.instantiate(props);
  }

  /**
   * Create an instance of this node's class.
   *
   * @param props - Properties to pass to the constructor.
   */
  public instantiate(props: NodeProps = {}): this {
    return new (<NodeConstructor<NodeProps, this>>this.constructor)(props);
  }

  /**
   * Whether this node should be cached or not.
   */
  protected requiresCache(): boolean {
    return (
      this.cache() ||
      this.opacity() < 1 ||
      this.compositeOperation() !== 'source-over' ||
      this.hasFilters() ||
      this.hasShadow()
    );
  }

  @computed()
  protected cacheCanvas(): CanvasRenderingContext2D {
    const canvas = document.createElement('canvas').getContext('2d');
    if (!canvas) {
      throw new Error('Could not create a cache canvas');
    }

    return canvas;
  }

  /**
   * Get a cache canvas with the contents of this node rendered onto it.
   */
  @computed()
  protected cachedCanvas() {
    const context = this.cacheCanvas();
    const cache = this.cacheRect();
    context.canvas.width = cache.width;
    context.canvas.height = cache.height;
    context.resetTransform();
    context.translate(-cache.x, -cache.y);
    this.draw(context);

    return context;
  }

  /**
   * Get a rectangle encapsulating the contents rendered by this node.
   *
   * @remarks
   * The returned rectangle should be in local space.
   */
  protected getCacheRect(): Rect {
    return new Rect();
  }

  /**
   * Get a rectangle encapsulating the contents rendered by this node as well
   * as its children.
   */
  @computed()
  public cacheRect(): Rect {
    const cache = this.getCacheRect();
    const children = this.children();
    if (children.length === 0) {
      return cache.pixelPerfect;
    }

    const points: Vector2[] = cache.corners;
    for (const child of children) {
      const childCache = child.fullCacheRect();
      const childMatrix = child.localToParent();
      points.push(
        ...childCache.corners.map(r => r.transformAsPoint(childMatrix)),
      );
    }

    return Rect.fromPoints(...points).pixelPerfect;
  }

  /**
   * Get a rectangle encapsulating the contents rendered by this node (including
   * effects applied after caching).
   *
   * @remarks
   * The returned rectangle should be in local space.
   */
  @computed()
  protected fullCacheRect(): Rect {
    const matrix = this.compositeToLocal();
    const shadowOffset = this.shadowOffset().transform(matrix);
    const shadowBlur = transformScalar(this.shadowBlur(), matrix);

    const result = this.cacheRect().expand(this.blur() * 2 + shadowBlur);

    if (shadowOffset.x < 0) {
      result.x += shadowOffset.x;
      result.width -= shadowOffset.x;
    } else {
      result.width += shadowOffset.x;
    }

    if (shadowOffset.y < 0) {
      result.y += shadowOffset.y;
      result.height -= shadowOffset.y;
    } else {
      result.height += shadowOffset.y;
    }

    return result;
  }

  /**
   * Prepare the given context for drawing a cached node onto it.
   *
   * @remarks
   * This method is called before the contents of the cache canvas are drawn
   * on the screen. It can be used to apply effects to the entire node together
   * with its children, instead of applying them individually.
   * Effects such as transparency, shadows, and filters use this technique.
   *
   * Whether the node is cached is decided by the {@link requiresCache} method.
   *
   * @param context - The context using which the cache will be drawn.
   */
  protected setupDrawFromCache(context: CanvasRenderingContext2D) {
    context.globalCompositeOperation = this.compositeOperation();
    context.globalAlpha = this.opacity();
    if (this.hasFilters()) {
      context.filter = this.filterString();
    }
    if (this.hasShadow()) {
      const matrix = this.compositeToWorld();
      const offset = this.shadowOffset().transform(matrix);
      const blur = transformScalar(this.shadowBlur(), matrix);

      context.shadowColor = this.shadowColor().serialize();
      context.shadowBlur = blur;
      context.shadowOffsetX = offset.x;
      context.shadowOffsetY = offset.y;
    }
  }

  /**
   * Render this node onto the given canvas.
   *
   * @param context - The context to draw with.
   */
  public render(context: CanvasRenderingContext2D) {
    if (this.absoluteOpacity() <= 0) {
      return;
    }

    context.save();
    this.transformContext(context);

    if (this.requiresCache()) {
      this.setupDrawFromCache(context);
      const cacheContext = this.cachedCanvas();
      const cacheRect = this.cacheRect();
      const compositeOverride = this.compositeOverride();
      context.drawImage(cacheContext.canvas, cacheRect.x, cacheRect.y);
      if (compositeOverride > 0) {
        context.save();
        context.globalAlpha *= compositeOverride;
        context.globalCompositeOperation = 'source-over';
        context.drawImage(cacheContext.canvas, cacheRect.x, cacheRect.y);
        context.restore();
      }
    } else {
      this.draw(context);
    }

    context.restore();
  }

  /**
   * Draw this node onto the canvas.
   *
   * @remarks
   * This method is used when drawing directly onto the screen as well as onto
   * the cache canvas.
   * It assumes that the context have already been transformed to local space.
   *
   * @param context - The context to draw with.
   */
  protected draw(context: CanvasRenderingContext2D) {
    this.drawChildren(context);
  }

  protected drawChildren(context: CanvasRenderingContext2D) {
    for (const child of this.children()) {
      child.render(context);
    }
  }

  /**
   * Draw an overlay for this node.
   *
   * @remarks
   * The overlay for the currently inspected node is displayed on top of the
   * canvas.
   *
   * The provided context is in screen space. The local-to-screen matrix can be
   * used to transform all shapes that need to be displayed.
   * This approach allows to keep the line widths and gizmo sizes consistent,
   * no matter how zoomed-in the view is.
   *
   * @param context - The context to draw with.
   * @param matrix - A local-to-screen matrix.
   */
  public drawOverlay(context: CanvasRenderingContext2D, matrix: DOMMatrix) {
    const rect = this.cacheRect().transformCorners(matrix);
    const cache = this.getCacheRect().transformCorners(matrix);
    context.strokeStyle = 'white';
    context.lineWidth = 1;
    context.beginPath();
    drawLine(context, rect);
    context.closePath();
    context.stroke();

    context.strokeStyle = 'blue';
    context.beginPath();
    drawLine(context, cache);
    context.closePath();
    context.stroke();
  }

  protected transformContext(context: CanvasRenderingContext2D) {
    const matrix = this.localToParent();
    context.transform(
      matrix.a,
      matrix.b,
      matrix.c,
      matrix.d,
      matrix.e,
      matrix.f,
    );
  }

  /**
   * Try to find a node intersecting the given position.
   *
   * @param position - The searched position.
   */
  public hit(position: Vector2): Node | null {
    let hit: Node | null = null;
    const local = position.transformAsPoint(this.localToParent().inverse());
    for (const child of this.children().reverse()) {
      hit = child.hit(local);
      if (hit) {
        break;
      }
    }

    return hit;
  }

  /**
   * Wait for any asynchronous resources that this node or its children have.
   *
   * @remarks
   * Certain resources like images are always loaded asynchronously.
   * Awaiting this method makes sure that all such resources are done loading
   * before continuing the animation.
   */
  public waitForAsyncResources() {
    this.collectAsyncResources();
    const promises = consumePromises();
    return Promise.all(promises.map(handle => handle.promise));
  }

  /**
   * Collect all asynchronous resources used by this node.
   */
  protected collectAsyncResources() {
    for (const child of this.children()) {
      child.collectAsyncResources();
    }
  }

  public async toPromise(): Promise<this> {
    await this.waitForAsyncResources();
    return this;
  }

  public *[Symbol.iterator]() {
    for (const key in this.properties) {
      const meta = this.properties[key];
      const signal = (<Record<string, Signal<any>>>(<unknown>this))[key];
      yield {meta, signal, key};
    }
  }
}

/*@__PURE__*/
Node.prototype.isClass = true;
