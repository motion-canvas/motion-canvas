import {
  compound,
  computed,
  initialize,
  Property,
  property,
} from '../decorators';
import {
  Vector2,
  transformPoint,
  transformAngle,
  Rect,
  Size,
} from '@motion-canvas/core/lib/types';
import {
  createSignal,
  isReactive,
  Reference,
  Signal,
  SignalValue,
} from '@motion-canvas/core/lib/utils';
import {
  vector2dLerp,
  sizeLerp,
  InterpolationFunction,
  TimingFunction,
  tween,
  map,
} from '@motion-canvas/core/lib/tweening';
import {Layout, LayoutProps, Length, ResolvedLayoutMode} from '../partials';
import {ComponentChild, ComponentChildren} from './types';
import {threadable} from '@motion-canvas/core/lib/decorators';
import {ThreadGenerator} from '@motion-canvas/core/lib/threading';

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
  cache?: boolean;
}

export class Node<TProps extends NodeProps = NodeProps> {
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
  @property(undefined, sizeLerp)
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
    value: SignalValue<Size>,
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
      to = value;
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
  @property(undefined, vector2dLerp)
  public declare readonly offset: Signal<Vector2, this>;

  @property(1)
  public declare readonly scaleX: Signal<number, this>;

  @property(1)
  public declare readonly scaleY: Signal<number, this>;

  @compound({x: 'scaleX', y: 'scaleY'})
  @property(undefined, vector2dLerp)
  public declare readonly scale: Signal<Vector2, this>;

  @property(false)
  public declare readonly cache: Signal<boolean, this>;

  @property(1)
  public declare readonly opacity: Signal<number, this>;

  @computed()
  public absoluteOpacity(): number {
    return (this.parent()?.absoluteOpacity() ?? 1) * this.opacity();
  }

  @compound(['x', 'y'])
  @property(undefined, vector2dLerp)
  public declare readonly position: Signal<Vector2, this>;

  @property(undefined, vector2dLerp)
  public declare readonly absolutePosition: Signal<Vector2, this>;

  protected getAbsolutePosition() {
    const matrix = this.localToWorld();
    return {x: matrix.m41, y: matrix.m42};
  }

  protected setAbsolutePosition(value: SignalValue<Vector2>) {
    if (isReactive(value)) {
      this.position(() => transformPoint(value(), this.worldToLocal()));
    } else {
      this.position(transformPoint(value, this.worldToLocal()));
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
      this.rotation(() => transformAngle(value(), this.worldToLocal()));
    } else {
      this.rotation(transformAngle(value, this.worldToLocal()));
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
      : new DOMMatrix();
  }

  @computed()
  protected worldToLocal(): DOMMatrix {
    const parent = this.parent();
    return parent ? parent.localToWorld().inverse() : new DOMMatrix();
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
  protected computedPosition(): Vector2 {
    const mode = this.mode();
    if (mode !== 'enabled') {
      return {
        x: this.customX(),
        y: this.customY(),
      };
    }

    this.requestLayoutUpdate();
    const rect = this.layout.getComputedLayout();

    const position = {
      x: rect.x + (rect.width / 2) * this.offsetX(),
      y: rect.y + (rect.height / 2) * this.offsetY(),
    };

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
    const rect = this.layout.getComputedLayout();

    return {
      width: rect.width,
      height: rect.height,
    };
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
    } else {
      parent.requestLayoutUpdate();
    }
  }

  /**
   * Apply any new layout changes to this node and its children.
   */
  @computed()
  protected updateLayout() {
    this.applyLayoutChanges();
    this.layout
      .setWidth(this.customWidth())
      .setHeight(this.customHeight())
      .apply();
    for (const child of this.children()) {
      child.updateLayout();
    }
  }

  /**
   * Apply any custom layout changes to this node.
   */
  protected applyLayoutChanges() {
    // do nothing
  }

  public append(node: ComponentChildren) {
    const nodes: ComponentChild[] = Array.isArray(node) ? node : [node];
    for (const node of nodes) {
      if (node instanceof Node) {
        node.moveTo(this);
      }
    }
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
    return this.cache() || (this.opacity() < 1 && this.children().length > 0);
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
    const rect = this.getCacheRect();
    context.canvas.width = rect.width;
    context.canvas.height = rect.height;
    context.resetTransform();
    context.translate(-rect.x, -rect.y);
    this.draw(context, true);

    return context;
  }

  /**
   * Get a rectangle encapsulating the contents rendered by this node.
   *
   * @remarks
   * The returned rectangle should be in local space.
   */
  protected getCacheRect(): Rect {
    const {width, height} = this.computedSize();
    return {
      width,
      height,
      x: width / -2,
      y: height / -2,
    };
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
  }

  /**
   * Render this node onto the given canvas.
   *
   * @param context - The context to draw with.
   */
  public render(context: CanvasRenderingContext2D) {
    context.save();

    if (this.requiresCache()) {
      this.transformContext(context);
      this.setupDrawFromCache(context);
      const cached = this.cachedCanvas();
      const rect = this.getCacheRect();
      context.drawImage(cached.canvas, rect.x, rect.y);
    } else {
      this.transformContext(context);
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
   * @param cache - Whether the node is being drawn onto the cache canvas.
   *                Certain effects can be omitted when caching and applied
   *                later when the cache canvas is drawn onto the screen.
   *                See {@link setupDrawFromCache} for more information.
   */
  protected draw(context: CanvasRenderingContext2D, cache = false) {
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
}

/*@__PURE__*/
Node.prototype.isClass = true;
