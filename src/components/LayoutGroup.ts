import {Group} from 'konva/lib/Group';
import {Container, ContainerConfig} from 'konva/lib/Container';
import {Origin, Size, PossibleSpacing, Spacing} from '../types';
import {
  getClientRect,
  getOriginDelta,
  getOriginOffset,
  ILayoutNode,
  isInsideLayout,
  LAYOUT_CHANGE_EVENT,
  LayoutAttrs,
} from '../components/ILayoutNode';
import Konva from 'konva';
import {IRect} from 'konva/lib/types';
import Vector2d = Konva.Vector2d;

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

  public setRadius(value: number): this {
    this.attrs.radius = value;
    this.fireLayoutChange();
    return this;
  }

  public getRadius(): number {
    return this.attrs.radius ?? 0;
  }

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

  public setColor(value: string): this {
    this.attrs.color = value;
    this.fireLayoutChange();
    return this;
  }

  public getColor(): string {
    return this.attrs.color ?? '#000';
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

  public getClientRect(config?: {
    skipTransform?: boolean;
    skipShadow?: boolean;
    skipStroke?: boolean;
    relativeTo?: Container;
  }): IRect {
    return getClientRect(this, config);
  }

  protected fireLayoutChange() {
    this.getParent()?.fire(LAYOUT_CHANGE_EVENT, undefined, true);
  }

  protected handleLayoutChange() {}
}
