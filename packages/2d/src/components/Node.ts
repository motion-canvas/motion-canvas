import {compoundProperty, initialize, property} from '../decorators';
import {Vector2} from '@motion-canvas/core/lib/types';
import {Reference, Signal, useSignal} from '@motion-canvas/core/lib/utils';
import {vector2dLerp} from '@motion-canvas/core/lib/tweening';
import {Layout, LayoutMode, LayoutProps} from '../layout';
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

  public readonly absolutePosition = useSignal(() => {
    const matrix = this.globalMatrix();
    return {x: matrix.e, y: matrix.f};
  });

  protected readonly globalMatrix = useSignal(() => this.localMatrix());

  protected readonly localMatrix = useSignal(() => {
    const matrix = new DOMMatrix();
    matrix.translateSelf(this.x(), this.y());
    matrix.rotateSelf(0, 0, this.rotation());
    matrix.scaleSelf(this.scaleX(), this.scaleY());
    matrix.translateSelf(
      (this.width() / -2) * this.offsetX(),
      (this.height() / -2) * this.offsetY(),
    );

    return matrix;
  });

  protected children: Node[] = [];
  protected parent: Node | null = null;

  public constructor({children, layout, ...rest}: TProps) {
    initialize(this, {defaults: rest});
    this.layout = new Layout(layout ?? {});
    this.append(children);
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
    if (this.parent === parent) {
      return;
    }

    if (this.parent) {
      this.globalMatrix(() => this.localMatrix());
      this.parent.layout.element.removeChild(this.layout.element);
      this.parent.children = this.parent.children.filter(
        child => child !== this,
      );
      this.parent = null;
    }

    if (parent) {
      this.globalMatrix(() =>
        parent.globalMatrix().multiply(this.localMatrix()),
      );
      parent.layout.element.append(this.layout.element);
      parent.children.push(this);
      this.parent = parent;
    }
  }

  public removeChildren() {
    for (const node of this.children) {
      node.moveTo(null);
    }
  }

  public updateLayout(): boolean {
    let isDirty = this.layout.updateIfNecessary();

    for (const child of this.children) {
      isDirty ||= child.updateLayout();
    }

    return isDirty;
  }

  public handleLayoutChange(parentMode?: LayoutMode) {
    let mode = this.layout.mode();

    if (mode === null) {
      if (!parentMode || parentMode === 'disabled') {
        mode = 'disabled';
      } else {
        mode = 'enabled';
      }
    }

    if (mode === 'enabled' && this.parent) {
      //TODO Cache this call or pass it as an argument
      const parentLayout = this.parent.layout.getComputedLayout();
      const thisLayout = this.layout.getComputedLayout();

      const offsetX = (thisLayout.width / 2) * this.offsetX();
      const offsetY = (thisLayout.height / 2) * this.offsetY();

      this.x(
        thisLayout.x -
          parentLayout.x -
          (parentLayout.width - thisLayout.width) / 2 +
          offsetX,
      );
      this.y(
        thisLayout.y -
          parentLayout.y -
          (parentLayout.height - thisLayout.height) / 2 +
          offsetY,
      );
      this.width(thisLayout.width);
      this.height(thisLayout.height);
    }
    if (mode === 'pop' || mode === 'root') {
      const thisLayout = this.layout.getComputedLayout();
      this.width(thisLayout.width);
      this.height(thisLayout.height);
    }

    for (const child of this.children) {
      child.handleLayoutChange(mode);
    }
  }

  public render(context: CanvasRenderingContext2D) {
    context.save();
    this.transformContext(context);

    for (const child of this.children) {
      child.render(context);
    }

    context.restore();
  }

  protected transformContext(context: CanvasRenderingContext2D) {
    const matrix = this.localMatrix();
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
