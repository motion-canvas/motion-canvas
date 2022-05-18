import {Node, NodeConfig} from 'konva/lib/Node';
import {
  Origin,
  PossibleSpacing,
  Size,
  Spacing,
  getOriginDelta,
  getOriginOffset,
} from '../types';
import {GetSet, IRect, Vector2d} from 'konva/lib/types';
import {Factory} from 'konva/lib/Factory';
import {Rect} from 'konva/lib/shapes/Rect';
import {Container} from 'konva/lib/Container';
import {Transform} from 'konva/lib/Util';
import {Konva} from 'konva/lib/Global';

declare module 'konva/lib/Node' {
  export interface Node {
    _centroid: boolean;
    padd: GetSet<PossibleSpacing, this>;
    margin: GetSet<PossibleSpacing, this>;
    origin: GetSet<Origin, this>;
    drawOrigin: GetSet<Origin, this>;
    setX(value: number): this;
    setY(value: number): this;
    setWidth(width: any): void;
    setHeight(height: any): void;
    setPadd(value: PossibleSpacing): this;
    setMargin(value: PossibleSpacing): this;
    setOrigin(value: Origin): this;
    getPadd(): Spacing;
    getMargin(): Spacing;
    getOrigin(): Origin;
    getLayoutSize(custom?: NodeConfig): Size;
    getOriginOffset(custom?: NodeConfig): Vector2d;
    getOriginDelta(newOrigin: Origin, custom?: NodeConfig): Vector2d;

    /**
     * Update the layout of this node and all its children.
     *
     * If the node is considered dirty the {@see recalculateLayout} method will be called.
     */
    updateLayout(): void;

    /**
     * Perform any computations necessary to update the layout of this node.
     */
    recalculateLayout(): void;

    /**
     * Mark this node as dirty.
     *
     * It will cause the layout of this node and all its ancestors to be recalculated before drawing the next frame.
     */
    markDirty(force?: boolean): void;

    /**
     * Check if this node is dirty.
     */
    isDirty(): boolean;

    /**
     * Check if the layout of this node has been recalculated during the current layout process.
     *
     * Containers can use this method to check if their children has changed.
     */
    wasDirty(): boolean;

    subscribe(event: string, handler: () => void): () => void;
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

Node.prototype.recalculateLayout = function (this: Node): void {};

Node.prototype.markDirty = function (this: Node, force: boolean = false): void {
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
Node.prototype._getTransform = function () {
  const m = super__getTransform.call(this);
  const offset = this.getOriginOffset();
  if (offset.x !== 0 || offset.y !== 0) {
    m.translate(-1 * offset.x, -1 * offset.y);
  }
  m.dirty = false;
  return m;
};

Factory.addGetterSetter(Node, 'padd', new Spacing());
Factory.addGetterSetter(Node, 'margin', new Spacing());
Factory.addGetterSetter(Node, 'origin', Origin.Middle);
