import {Container} from 'konva/lib/Container';
import {Shape, ShapeConfig} from 'konva/lib/Shape';
import {
  getOriginDelta,
  getOriginOffset,
  ILayoutNode,
  isInsideLayout,
  LAYOUT_CHANGE_EVENT,
  LayoutAttrs,
  getClientRect,
} from './ILayoutNode';
import {Origin, Size, PossibleSpacing, Spacing} from '../types';
import {IRect, Vector2d} from 'konva/lib/types';

export type LayoutShapeConfig = Partial<LayoutAttrs> & ShapeConfig;

export abstract class LayoutShape extends Shape implements ILayoutNode {
  public constructor(config?: LayoutShapeConfig) {
    super(config);
    this.on(LAYOUT_CHANGE_EVENT, () => this.handleLayoutChange());
    this.handleLayoutChange();
  }

  public getLayoutSize(custom?: LayoutShapeConfig): Size {
    const padding =
      (custom?.padd === null || custom?.padd === undefined)
        ? this.getPadd()
        : new Spacing(custom.padd);

    return padding.expand(this.getSize());
  }

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

  public getOriginOffset(custom?: LayoutShapeConfig): Vector2d {
    return getOriginOffset(
      this.getLayoutSize(custom),
      custom?.origin ?? this.getOrigin(),
    );
  }

  public getOriginDelta(newOrigin: Origin, custom?: LayoutShapeConfig) {
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
