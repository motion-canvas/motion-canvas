import {compoundProperty, computed, initialize, property} from '../decorators';
import {
  Vector2,
  transformPoint,
  transformAngle,
  Rect,
} from '@motion-canvas/core/lib/types';
import {
  createSignal,
  isReactive,
  Reference,
  Signal,
  SignalValue,
} from '@motion-canvas/core/lib/utils';
import {vector2dLerp} from '@motion-canvas/core/lib/tweening';
import {Layout, LayoutProps} from '../layout';
import {ComponentChild, ComponentChildren} from './types';

export interface NodeProps {
  ref?: Reference<Node>;
  children?: ComponentChildren;
  x?: number;
  y?: number;
  position?: Vector2;
  width?: number;
  height?: number;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
  scaleX?: number;
  scaleY?: number;
  layout?: LayoutProps;
}

export class Node<TProps extends NodeProps = NodeProps> {
  public declare isClass: boolean;

  public readonly layout: Layout;

  @property(0)
  public declare readonly x: Signal<number, this>;

  @property(0)
  public declare readonly y: Signal<number, this>;

  @property(0)
  public declare readonly width: Signal<number, this>;

  @property(0)
  public declare readonly height: Signal<number, this>;

  @property(0)
  public declare readonly rotation: Signal<number, this>;

  @property(1)
  public declare readonly scaleX: Signal<number, this>;

  @property(1)
  public declare readonly scaleY: Signal<number, this>;

  @property(0)
  public declare readonly offsetX: Signal<number, this>;

  @property(0)
  public declare readonly offsetY: Signal<number, this>;

  @compoundProperty(['x', 'y'], vector2dLerp)
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

  protected children = createSignal<Node[]>([]);
  protected parent = createSignal<Node | null>(null);

  public constructor({children, layout, ...rest}: TProps) {
    initialize(this, {defaults: rest});
    this.layout = new Layout(layout ?? {});
    this.append(children);
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
    const rect = this.clientRect();
    const matrix = new DOMMatrix();
    matrix.translateSelf(rect.x, rect.y);
    matrix.rotateSelf(0, 0, this.rotation());
    matrix.scaleSelf(this.scaleX(), this.scaleY());
    matrix.translateSelf(
      (rect.width / -2) * this.offsetX(),
      (rect.height / -2) * this.offsetY(),
    );

    return matrix;
  }

  @computed()
  protected computedLayout(): Rect {
    this.requestLayoutUpdate();
    const rect = this.layout.getComputedLayout();
    return {
      x: rect.x,
      y: rect.y,
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
    this.layout.apply();
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
      node.moveTo(null);
    }
  }

  @computed()
  public realMode() {
    const parent = this.parent();
    const parentMode = parent?.realMode();
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
  public clientRect() {
    const mode = this.realMode();
    const parent = this.parent();

    const rect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    if (mode === 'enabled' && parent) {
      const parentLayout = parent.computedLayout();
      const thisLayout = this.computedLayout();

      const offsetX = (thisLayout.width / 2) * this.offsetX();
      const offsetY = (thisLayout.height / 2) * this.offsetY();

      rect.x =
        thisLayout.x -
        parentLayout.x -
        (parentLayout.width - thisLayout.width) / 2 +
        offsetX;
      rect.y =
        thisLayout.y -
        parentLayout.y -
        (parentLayout.height - thisLayout.height) / 2 +
        offsetY;
      rect.width = thisLayout.width;
      rect.height = thisLayout.height;
    } else if (mode === 'pop' || mode === 'root') {
      const thisLayout = this.computedLayout();
      rect.x = this.x();
      rect.y = this.y();
      rect.width = thisLayout.width;
      rect.height = thisLayout.height;
    } else {
      rect.x = this.x();
      rect.y = this.y();
      rect.width = this.width();
      rect.height = this.height();
    }

    return rect;
  }

  public render(context: CanvasRenderingContext2D) {
    context.save();
    this.transformContext(context);

    for (const child of this.children()) {
      child.render(context);
    }

    context.restore();
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
