import {Group} from 'konva/lib/Group';
import {ContainerConfig} from 'konva/lib/Container';
import {Vector2d} from 'konva/lib/types';
import {Origin, Size, PossibleSpacing, Spacing} from '../types';
import {
  getOriginDelta,
  getOriginOffset,
  ILayoutNode,
  isInsideLayout,
  LAYOUT_CHANGE_EVENT,
  LayoutAttrs,
} from '../components/ILayoutNode';
import {Node} from 'konva/lib/Node';

export type LayoutGroupConfig = Partial<LayoutAttrs> & ContainerConfig;

export abstract class LayoutGroup extends Group implements ILayoutNode {
  public constructor(config?: LayoutGroupConfig) {
    super({
      color: '#242424',
      radius: 8,
      ...config,
    });
    this.on(LAYOUT_CHANGE_EVENT, () => this.handleLayoutChange());
    this.handleLayoutChange();
  }

  public abstract getLayoutSize(custom?: LayoutGroupConfig): Size;

  public setMargin(value: PossibleSpacing): this {
    this.attrs.margin = new Spacing(value);
    this.fireLayoutChange();
    return this;
  }

  public getMargin(): Spacing {
    return this.attrs.margin ?? new Spacing();
  }

  public setPadd(value: PossibleSpacing): this {
    this.attrs.padd = new Spacing(value);
    this.fireLayoutChange();
    return this;
  }

  public getPadd(): Spacing {
    return this.attrs.padd ?? new Spacing();
  }

  public setOrigin(value: Origin): this {
    if (!isInsideLayout(this)) {
      this.move(this.getOriginDelta(value));
    }
    this.attrs.origin = value;
    this.offset(this.getOriginOffset());
    this.fireLayoutChange();

    return this;
  }

  public findOne<ChildNode extends Node>(
    selector: string | Function | (new (...args: any[]) => ChildNode),
  ): ChildNode {
    //@ts-ignore
    return super.findOne<ChildNode>(selector.prototype?.className ?? selector);
  }

  public getOrigin(): Origin {
    return this.attrs.origin ?? Origin.Middle;
  }

  public withOrigin(origin: Origin, action: () => void) {
    const previousOrigin = this.getOrigin();
    this.setOrigin(origin);
    action();
    this.setOrigin(previousOrigin);
  }

  public getOriginOffset(custom?: LayoutGroupConfig): Vector2d {
    return getOriginOffset(
      this.getLayoutSize(custom),
      custom?.origin ?? this.getOrigin(),
    );
  }

  public getOriginDelta(newOrigin: Origin, custom?: LayoutGroupConfig) {
    return getOriginDelta(
      this.getLayoutSize(custom),
      custom?.origin ?? this.getOrigin(),
      newOrigin,
    );
  }

  protected fireLayoutChange() {
    this.getParent()?.fire(LAYOUT_CHANGE_EVENT, undefined, true);
  }

  protected handleLayoutChange() {}
}
