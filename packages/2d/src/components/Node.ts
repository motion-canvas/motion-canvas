import {
  compound,
  computed,
  initialize,
  Property,
  property,
} from '../decorators';
import {
  Vector2,
  transformAngle,
  Rect,
  Size,
  transformScalar,
} from '@motion-canvas/core/lib/types';
import {
  createSignal,
  isReactive,
  Reference,
  Signal,
  SignalValue,
} from '@motion-canvas/core/lib/utils';
import {
  InterpolationFunction,
  TimingFunction,
  tween,
  map,
} from '@motion-canvas/core/lib/tweening';
import {Layout, LayoutProps, Length, ResolvedLayoutMode} from '../partials';
import {ComponentChild, ComponentChildren} from './types';
import {threadable} from '@motion-canvas/core/lib/decorators';
import {ThreadGenerator, Promisable} from '@motion-canvas/core/lib/threading';

export interface NodeProps {
  ref?: Reference<Node>;
  children?: ComponentChildren;
  x?: number;
  y?: number;
  position?: Vector2;
  width?: Length;
  height?: Length;
  size?: Size;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
  offset?: Vector2;
  scaleX?: number;
  scaleY?: number;
  scale?: Vector2;
  layout?: LayoutProps;
  opacity?: number;
  blur?: number;
  brightness?: number;
  contrast?: number;
  grayscale?: number;
  hue?: number;
  invert?: number;
  saturate?: number;
  sepia?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOffset?: Vector2;
  overflow?: boolean;
  cache?: boolean;
  composite?: boolean | Node;
}

export class Node<TProps extends NodeProps = NodeProps>
  implements Promisable<Node>
{
  public declare isClass: boolean;

  public readonly layout: Layout;

  @property(0)
  public declare readonly x: Signal<number, this>;
  protected readonly customX = createSignal(0, map, this);
  protected getX(): number {
    return this.computedPosition().x;
  }
  protected setX(value: SignalValue<number>) {
    this.customX(value);
  }

  @property(0)
  public declare readonly y: Signal<number, this>;
  protected readonly customY = createSignal(0, map, this);
  protected getY(): number {
    return this.computedPosition().y;
  }
  protected setY(value: SignalValue<number>) {
    this.customY(value);
  }

  @property(null)
  public declare readonly width: Property<Length, number, this>;
  protected readonly customWidth = createSignal<Length, this>(
    undefined,
    undefined,
    this,
  );
  protected getWidth(): number {
    return this.computedSize().width;
  }
  protected setWidth(value: SignalValue<Length>) {
    this.customWidth(value);
  }

  @threadable()
  protected *tweenWidth(
    value: SignalValue<Length>,
    time: number,
    timingFunction: TimingFunction,
    interpolationFunction: InterpolationFunction<Length>,
  ): ThreadGenerator {
    const width = this.customWidth();
    let from: number;
    if (typeof width === 'number') {
      from = width;
    } else {
      from = this.width();
    }

    let to: number;
    if (typeof value === 'number') {
      to = value;
    } else {
      this.width(value);
      to = this.width();
    }

    this.width(from);
    this.layout.lockSize();
    yield* tween(time, value =>
      this.width(interpolationFunction(from, to, timingFunction(value))),
    );
    this.width(value);
    this.layout.releaseSize();
  }

  @property(null)
  public declare readonly height: Property<Length, number, this>;
  protected readonly customHeight = createSignal<Length, this>(
    undefined,
    undefined,
    this,
  );
  protected getHeight(): number {
    return this.computedSize().height;
  }
  protected setHeight(value: SignalValue<Length>) {
    this.customHeight(value);
  }

  @threadable()
  protected *tweenHeight(
    value: SignalValue<Length>,
    time: number,
    timingFunction: TimingFunction,
    interpolationFunction: InterpolationFunction<Length>,
  ): ThreadGenerator {
    const height = this.customHeight();
    let from: number;
    if (typeof height === 'number') {
      from = height;
    } else {
      from = this.height();
    }

    let to: number;
    if (typeof value === 'number') {
      to = value;
    } else {
      this.height(value);
      to = this.height();
    }

    this.height(from);
    this.layout.lockSize();
    yield* tween(time, value =>
      this.height(interpolationFunction(from, to, timingFunction(value))),
    );
    this.height(value);
    this.layout.releaseSize();
  }

  @compound(['width', 'height'])
  @property(undefined, Size.lerp, Size)
  public declare readonly size: Property<
    {width: Length; height: Length},
    Size,
    this
  >;

  @computed()
  protected customSize(): {width: Length; height: Length} {
    return {
      width: this.customWidth(),
      height: this.customHeight(),
    };
  }

  @threadable()
  protected *tweenSize(
    value: SignalValue<{width: Length; height: Length}>,
    time: number,
    timingFunction: TimingFunction,
    interpolationFunction: InterpolationFunction<Size>,
  ): ThreadGenerator {
    const size = this.customSize();
    let from: Size;
    if (typeof size.height !== 'number' || typeof size.width !== 'number') {
      from = this.size();
    } else {
      from = <Size>size;
    }

    let to: Size;
    if (
      typeof value === 'object' &&
      typeof value.height === 'number' &&
      typeof value.width === 'number'
    ) {
      to = <Size>value;
    } else {
      this.size(value);
      to = this.size();
    }

    this.size(from);
    this.layout.lockSize();
    yield* tween(time, value =>
      this.size(interpolationFunction(from, to, timingFunction(value))),
    );
    this.layout.releaseSize();
    this.size(value);
  }

  @property(0)
  public declare readonly rotation: Signal<number, this>;

  @property(0)
  public declare readonly offsetX: Signal<number, this>;

  @property(0)
  public declare readonly offsetY: Signal<number, this>;

  @compound({x: 'offsetX', y: 'offsetY'})
  @property(undefined, Vector2.lerp, Vector2)
  public declare readonly offset: Signal<Vector2, this>;

  @property(1)
  public declare readonly scaleX: Signal<number, this>;

  @property(1)
  public declare readonly scaleY: Signal<number, this>;

  @compound({x: 'scaleX', y: 'scaleY'})
  @property(undefined, Vector2.lerp, Vector2)
  public declare readonly scale: Signal<Vector2, this>;

  @property(false)
  public declare readonly overflow: Signal<boolean, this>;

  @property(false)
  public declare readonly cache: Signal<boolean, this>;

  @property(false)
  public declare readonly composite: Signal<boolean, this>;

  @property(1)
  public declare readonly opacity: Signal<number, this>;

  @computed()
  public absoluteOpacity(): number {
    return (this.parent()?.absoluteOpacity() ?? 1) * this.opacity();
  }

  @property(0)
  public declare readonly blur: Signal<number, this>;

  @property(1)
  public declare readonly brightness: Signal<number, this>;

  @property(1)
  public declare readonly contrast: Signal<number, this>;

  @property(0)
  public declare readonly grayscale: Signal<number, this>;

  @property(0)
  public declare readonly hue: Signal<number, this>;

  @property(0)
  public declare readonly invert: Signal<number, this>;

  @property(1)
  public declare readonly saturate: Signal<number, this>;

  @property(0)
  public declare readonly sepia: Signal<number, this>;

  @property('')
  public declare readonly shadowColor: Signal<string, this>;

  @property(0)
  public declare readonly shadowBlur: Signal<number, this>;

  @property(0)
  public declare readonly shadowOffsetX: Signal<number, this>;

  @property(0)
  public declare readonly shadowOffsetY: Signal<number, this>;

  @compound({x: 'shadowOffsetX', y: 'shadowOffsetY'})
  @property(undefined, Vector2.lerp, Vector2)
  public declare readonly shadowOffset: Signal<Vector2, this>;

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
        this.shadowOffsetX() !== 0 ||
        this.shadowOffsetY() !== 0)
    );
  }

  @computed()
  protected filterString(): string {
    let filters = '';

    const blur = this.blur();
    if (blur !== 0) {
      filters += ` blur(${transformScalar(blur, this.compositeToWorld())}px)`;
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
    const invert = this.invert();
    if (invert !== 0) {
      filters += ` invert(${invert * 100}%)`;
    }
    const saturate = this.saturate();
    if (saturate !== 1) {
      filters += ` saturate(${saturate * 100}%)`;
    }
    const sepia = this.sepia();
    if (sepia !== 0) {
      filters += ` sepia(${sepia * 100}%)`;
    }

    return filters;
  }

  @compound(['x', 'y'])
  @property(undefined, Vector2.lerp, Vector2)
  public declare readonly position: Signal<Vector2, this>;

  @property(undefined, Vector2.lerp, Vector2)
  public declare readonly absolutePosition: Signal<Vector2, this>;

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

  @property()
  public declare readonly absoluteRotation: Signal<Vector2, this>;

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

  protected readonly children = createSignal<Node[]>([]);
  protected readonly parent = createSignal<Node | null>(null);
  protected readonly quality = createSignal(false);

  public constructor({children, layout, ...rest}: TProps) {
    this.layout = new Layout(layout ?? {});
    initialize(this, {defaults: rest});
    this.append(children);
  }

  /**
   * Get the resolved layout mode of this node.
   *
   * @remarks
   * When the mode is `null`, its value will be inherited from the parent.
   *
   * Use {@link Layout.mode} to get the raw mode set for this node (without
   * inheritance).
   */
  @computed()
  public mode(): ResolvedLayoutMode {
    const parent = this.parent();
    const parentMode = parent?.mode();
    let mode = this.layout.mode();

    if (mode === null) {
      if (!parentMode || parentMode === 'disabled') {
        mode = 'disabled';
      } else {
        mode = 'enabled';
      }
    }

    return mode;
  }

  @computed()
  protected localToWorld(): DOMMatrix {
    const parent = this.parent();
    return parent
      ? parent.localToWorld().multiply(this.localToParent())
      : this.localToParent();
  }

  @computed()
  protected worldToLocal() {
    return this.localToWorld().inverse();
  }

  @computed()
  protected worldToParent(): DOMMatrix {
    return this.parent()?.worldToLocal() ?? new DOMMatrix();
  }

  @computed()
  protected localToParent(): DOMMatrix {
    const matrix = new DOMMatrix();
    const size = this.computedSize();
    const position = this.computedPosition();
    matrix.translateSelf(position.x, position.y);
    matrix.rotateSelf(0, 0, this.rotation());
    matrix.scaleSelf(this.scaleX(), this.scaleY());
    matrix.translateSelf(
      (size.width / -2) * this.offsetX(),
      (size.height / -2) * this.offsetY(),
    );

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
    return root
      ? root.localToWorld().multiply(this.worldToLocal())
      : new DOMMatrix();
  }

  @computed()
  protected computedPosition(): Vector2 {
    const mode = this.mode();
    if (mode !== 'enabled') {
      return new Vector2(this.customX(), this.customY());
    }

    this.requestLayoutUpdate();
    this.requestFontUpdate();
    const rect = this.layout.getComputedLayout();

    const position = new Vector2(
      rect.x + (rect.width / 2) * this.offsetX(),
      rect.y + (rect.height / 2) * this.offsetY(),
    );

    const parent = this.parent();
    if (parent) {
      const parentRect = parent.layout.getComputedLayout();
      position.x -= parentRect.x + (parentRect.width - rect.width) / 2;
      position.y -= parentRect.y + (parentRect.height - rect.height) / 2;
    }

    return position;
  }

  @computed()
  protected computedSize(): Size {
    this.requestLayoutUpdate();
    this.requestFontUpdate();
    const rect = this.layout.getComputedLayout();

    return new Size(rect);
  }

  /**
   * Find the closest layout root and apply any new layout changes.
   */
  @computed()
  protected requestLayoutUpdate() {
    const mode = this.layout.mode();
    const parent = this.parent();
    if (mode === 'disabled' || mode === 'root' || !parent) {
      this.updateLayout();
      parent?.requestFontUpdate();
    } else {
      parent.requestLayoutUpdate();
    }
  }

  /**
   * Apply any new layout changes to this node and its children.
   */
  @computed()
  protected updateLayout() {
    this.updateFont();
    this.layout
      .setWidth(this.customWidth())
      .setHeight(this.customHeight())
      .applyFlex();
    this.applyLayoutChanges();
    for (const child of this.children()) {
      child.updateLayout();
    }
  }

  /**
   * Apply any custom layout-related changes to this node.
   */
  protected applyLayoutChanges() {
    // do nothing
  }

  /**
   * Apply any new font changes to this node and all of its ancestors.
   */
  @computed()
  protected requestFontUpdate() {
    this.parent()?.requestFontUpdate();
    this.updateFont();
  }

  /**
   * Apply any new font changes to this node.
   */
  @computed()
  protected updateFont() {
    this.layout.applyFont();
    this.applyFontChanges();
  }

  /**
   * Apply any custom font-related changes to this node.
   */
  protected applyFontChanges() {
    // do nothing
  }

  public append(node: ComponentChildren): this {
    const nodes: ComponentChild[] = Array.isArray(node) ? node : [node];
    for (const node of nodes) {
      if (node instanceof Node) {
        node.moveTo(this);
      }
    }

    return this;
  }

  public remove() {
    this.moveTo(null);
  }

  protected moveTo(parent: Node | null) {
    const current = this.parent();
    if (current === parent) {
      return;
    }

    if (current) {
      current.layout.element.removeChild(this.layout.element);
      current.children(current.children().filter(child => child !== this));
    }

    if (parent) {
      parent.layout.element.append(this.layout.element);
      parent.children([...parent.children(), this]);
    }

    this.parent(parent);
  }

  public removeChildren() {
    for (const node of this.children()) {
      node.remove();
    }
  }

  /**
   * Whether this node should be cached or not.
   */
  protected requiresCache(): boolean {
    return (
      this.cache() ||
      this.opacity() < 1 ||
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
    const size = this.computedSize();
    return new Rect(size.vector.scale(-0.5), size);
  }

  /**
   * Get a rectangle encapsulating the contents rendered by this node (including
   * effects applied after caching).
   *
   * @remarks
   * The returned rectangle should be in local space.
   */
  protected getFullCacheRect() {
    const matrix = this.compositeToLocal();
    const shadowOffset = this.shadowOffset().transform(matrix);
    const shadowBlur = transformScalar(this.shadowBlur(), matrix);

    const result = this.getCacheRect().expand(this.blur() * 2 + shadowBlur);

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
   * Get a rectangle encapsulating the contents rendered by this node as well
   * as its children.
   */
  @computed()
  protected cacheRect(): Rect {
    const cache = this.getCacheRect();
    const children = this.children();
    if (!this.overflow() || children.length === 0) {
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

  @computed()
  protected fullCacheRect(): Rect {
    return Rect.fromRects(this.cacheRect(), this.getFullCacheRect());
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
    context.globalAlpha = this.opacity();
    if (this.hasFilters()) {
      context.filter = this.filterString();
    }
    if (this.hasShadow()) {
      const matrix = this.compositeToWorld();
      const offset = this.shadowOffset().transform(matrix);
      const blur = transformScalar(this.shadowBlur(), matrix);

      context.shadowColor = this.shadowColor();
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
    context.save();
    this.transformContext(context);

    if (this.requiresCache()) {
      this.setupDrawFromCache(context);
      const cacheContext = this.cachedCanvas();
      const cacheRect = this.cacheRect();
      context.drawImage(cacheContext.canvas, cacheRect.x, cacheRect.y);
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
    for (const child of this.children()) {
      child.render(context);
    }
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
   * Wait for any asynchronous resources that this node or its children have.
   *
   * @remarks
   * Certain resources like images are always loaded asynchronously.
   * Awaiting this method makes sure that all such resources are done loading
   * before continuing the animation.
   */
  public waitForAsyncResources() {
    const deps: Promise<any>[] = [];
    this.collectAsyncResources(deps);
    return Promise.all(deps);
  }

  /**
   * Collect all asynchronous resources used by this node and put them in the
   * `resources` array.
   *
   * @param resources - An array to which resources should be collected.
   */
  protected collectAsyncResources(resources: Promise<any>[]) {
    for (const child of this.children()) {
      child.collectAsyncResources(resources);
    }
  }

  public async toPromise(): Promise<this> {
    await this.waitForAsyncResources();
    return this;
  }
}

/*@__PURE__*/
Node.prototype.isClass = true;
