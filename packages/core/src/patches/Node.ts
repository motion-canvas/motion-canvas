import type {Style} from '../styles';
import {Node, NodeConfig} from 'konva/lib/Node';
import {Origin, PossibleSpacing, Size, Spacing, getOriginDelta} from '../types';
import {GetSet, IRect, Vector2d} from 'konva/lib/types';
import {Factory} from 'konva/lib/Factory';
import {Container} from 'konva/lib/Container';
import {NODE_ID} from '../symbols';
import {useScene} from '../utils';

declare module 'konva/lib/Node' {
  export interface Node {
    /**
     * @internal
     */
    _centroid: boolean;

    style?: GetSet<Partial<Style>, this>;

    /**
     * The empty space between the borders of this node and its content.
     *
     * Analogous to CSS padding.
     */
    padd: GetSet<PossibleSpacing, this>;

    /**
     * The empty space between the borders of this node and surrounding nodes.
     *
     * Analogous to CSS margin.
     */
    margin: GetSet<PossibleSpacing, this>;

    /**
     * The origin of this node.
     *
     * By default, each node has its origin in the middle.
     *
     * Analogous to CSS margin.
     */
    origin: GetSet<Origin, this>;

    /**
     * @ignore
     */
    setX(value: number): this;

    /**
     * @ignore
     */
    setY(value: number): this;

    /**
     * @ignore
     */
    setWidth(width: number): void;

    /**
     * @ignore
     */
    setHeight(height: number): void;

    /**
     * @ignore
     */
    setPadd(value: PossibleSpacing): this;

    /**
     * @ignore
     */
    setMargin(value: PossibleSpacing): this;

    /**
     * @ignore
     */
    setOrigin(value: Origin): this;

    /**
     * @ignore
     */
    getPadd(): Spacing;

    /**
     * @ignore
     */
    getMargin(): Spacing;

    /**
     * @ignore
     */
    getOrigin(): Origin;

    /**
     * Get the size of this node used for layout calculations.
     *
     * @remarks
     * The returned size should include the padding.
     * A node can use the size of its children to derive its own dimensions.
     *
     * @param custom - Custom node configuration to use during the calculations.
     *                 When present, the method will return the layout size that
     *                 the node would have, if it had these options configured.
     */
    getLayoutSize(custom?: NodeConfig): Size;

    /**
     * Get the vector from the local origin of this node to its current origin.
     *
     * @remarks
     * The local origin is the center of coordinates of the canvas when drawing
     * the node. Centroid nodes will have their local origin at the center.
     * Other shapes will have it in the top left corner.
     *
     * The current origin is configured via {@link Node.origin}.
     *
     * @param custom - Custom node configuration to use during the calculations.
     *                 When present, the method will return the origin offset
     *                 that the node would have, if it had these options
     *                 configured.
     */
    getOriginOffset(custom?: NodeConfig): Vector2d;

    /**
     * Get the vector from the current origin of this node to the `newOrigin`.
     *
     * @param newOrigin - The origin to which the delta should be calculated.
     *
     * @param custom - Custom node configuration to use during the calculations.
     *                 When present, the method will return the origin offset
     *                 that the node would have, if it had these options
     *                 configured.
     */
    getOriginDelta(newOrigin: Origin, custom?: NodeConfig): Vector2d;

    /**
     * Update the layout of this node and all its children.
     *
     * @remarks
     * If the node is considered dirty the {@link recalculateLayout} method will
     * be called.
     */
    updateLayout(): void;

    /**
     * Perform any computations necessary to update the layout of this node.
     */
    recalculateLayout(): void;

    /**
     * Mark this node as dirty.
     *
     * @remarks
     * It will cause the layout of this node and all its ancestors to be
     * recalculated before drawing the next frame.
     */
    markDirty(force?: boolean): void;

    /**
     * Check if this node is dirty.
     */
    isDirty(): boolean;

    /**
     * Check if the layout of this node has been recalculated during the current
     * layout process.
     *
     * @remarks
     * Containers can use this method to check if their children has changed.
     */
    wasDirty(): boolean;

    subscribe(event: string, handler: () => void): () => void;

    _clearCache(attr?: string | Callback): void;
  }

  export interface NodeConfig {
    margin?: PossibleSpacing;
    padd?: PossibleSpacing;
    origin?: Origin;
  }
}

Node.prototype.setPadd = function (this: Node, value: PossibleSpacing) {
  this.attrs.padd = new Spacing(value);
  this.markDirty();
  return this;
};

Node.prototype.setMargin = function (this: Node, value: PossibleSpacing) {
  this.attrs.margin = new Spacing(value);
  this.markDirty();
  return this;
};

Node.prototype.setOrigin = function (this: Node, value: Origin) {
  this.attrs.origin = value;
  this.markDirty();
  return this;
};

Node.prototype.getLayoutSize = function (
  this: Node,
  custom?: NodeConfig,
): Size {
  const padding =
    custom?.padd === null || custom?.padd === undefined
      ? this.getPadd()
      : new Spacing(custom.padd);

  return padding.expand(this.getSize());
};

Node.prototype.getOriginOffset = function (
  this: Node,
  custom?: NodeConfig,
): Vector2d {
  return getOriginDelta(
    this.getLayoutSize(custom),
    this._centroid ? Origin.Middle : Origin.TopLeft,
    custom?.origin ?? this.getOrigin(),
  );
};

Node.prototype.getOriginDelta = function (
  this: Node,
  newOrigin?: Origin,
  custom?: NodeConfig,
): Vector2d {
  return getOriginDelta(
    this.getLayoutSize(custom),
    custom?.origin ?? this.getOrigin(),
    newOrigin,
  );
};

Node.prototype.updateLayout = function (this: Node): void {
  this.attrs.wasDirty = false;
  if (this.isDirty()) {
    this.recalculateLayout();
    this.attrs.dirty = false;
    this.attrs.wasDirty = true;
  }
};

Node.prototype.recalculateLayout = function (this: Node): void {
  // do nothing
};

Node.prototype.markDirty = function (this: Node, force = false): void {
  this.attrs.dirty = true;
  if (
    force ||
    // When the layout size changes and the origin is other than default,
    // the transform will also most likely change.
    (this._centroid ? Origin.Middle : Origin.TopLeft) !== this.origin()
  ) {
    this._clearCache('transform');
    this._clearCache('absoluteTransform');
  }
};

Node.prototype.isDirty = function (this: Node): boolean {
  return this.attrs.dirty;
};

Node.prototype.wasDirty = function (this: Node): boolean {
  return this.attrs.wasDirty;
};

Node.prototype.subscribe = function (
  this: Node,
  event: string,
  handler: () => void,
): () => void {
  this.on(event, handler);
  return () => this.off(event, handler);
};

Node.prototype.getClientRect = function (
  this: Node,
  config?: {
    skipTransform?: boolean;
    skipShadow?: boolean;
    skipStroke?: boolean;
    relativeTo?: Container;
  },
): IRect {
  const size = this.getLayoutSize();
  const offset = this.getOriginOffset({origin: Origin.TopLeft});

  const rect: IRect = {
    x: offset.x,
    y: offset.y,
    width: size.width,
    height: size.height,
  };

  if (!config?.skipTransform) {
    return this._transformedRect(rect, config?.relativeTo);
  }

  return rect;
};

const super_setX = Node.prototype.setX;
Node.prototype.setX = function (this: Node, value: number) {
  if (this.attrs.x !== value) this.markDirty();
  return super_setX.call(this, value);
};

const super_setY = Node.prototype.setY;
Node.prototype.setY = function (this: Node, value: number) {
  if (this.attrs.y !== value) this.markDirty();
  return super_setY.call(this, value);
};

const super_setWidth = Node.prototype.setWidth;
Node.prototype.setWidth = function (this: Node, value: number) {
  if (this.attrs.width !== value) {
    this.markDirty();
  }
  return super_setWidth.call(this, value);
};

const super_setHeight = Node.prototype.setHeight;
Node.prototype.setHeight = function (this: Node, value: number) {
  if (this.attrs.height !== value) {
    this.markDirty();
  }
  return super_setHeight.call(this, value);
};

const super__getTransform = Node.prototype._getTransform;
Node.prototype._getTransform = function (this: Node) {
  const m = super__getTransform.call(this);
  const offset = this.getOriginOffset();
  if (offset.x !== 0 || offset.y !== 0) {
    m.translate(-1 * offset.x, -1 * offset.y);
  }
  m.dirty = false;
  return m;
};

const super_setAttrs = Node.prototype.setAttrs;
Node.prototype.setAttrs = function (this: Node, config: unknown) {
  if (!(NODE_ID in this.attrs)) {
    const scene: any = useScene();
    if (scene && 'generateNodeId' in scene) {
      const type = this.className;
      this.attrs[NODE_ID] = scene.generateNodeId(type);
    }
  }
  return super_setAttrs.call(this, config);
};

const super__clearCache = Node.prototype._clearCache;
Node.prototype._clearCache = function (this: Node, attr?: string | Callback) {
  if (typeof attr === 'function') {
    if (attr.prototype?.cachedKey) {
      this._cache.delete(attr.prototype.cachedKey);
    }
  } else {
    super__clearCache.call(this, attr);
  }
};

Factory.addGetterSetter(Node, 'padd', new Spacing());
Factory.addGetterSetter(Node, 'margin', new Spacing());
Factory.addGetterSetter(Node, 'origin', Origin.Middle);
