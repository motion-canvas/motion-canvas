import {compound, computed, initialize, property} from '../decorators';
import {Vector2, Rect, transformScalar} from '@motion-canvas/core/lib/types';
import {createSignal, Reference, Signal} from '@motion-canvas/core/lib/utils';
import {ComponentChild, ComponentChildren} from './types';
import {Promisable} from '@motion-canvas/core/lib/threading';
import {TwoDView} from '../scenes';

export interface NodeProps {
  ref?: Reference<Node>;
  children?: ComponentChildren;
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
  cache?: boolean;
  composite?: boolean;
}

export class Node implements Promisable<Node> {
  public declare isClass: boolean;

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

  @compound({x: 'shadowOffsetX', y: 'shadowOffsetY'}, Vector2)
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

  public constructor({children, ...rest}: NodeProps) {
    initialize(this, {defaults: rest});
    this.append(children);
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
    return new DOMMatrix();
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
  public view(): TwoDView | null {
    return this.parent()?.view() ?? null;
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
      current.children(current.children().filter(child => child !== this));
    }

    if (parent) {
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
