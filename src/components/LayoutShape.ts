import {Container} from 'konva/lib/Container';
import {Origin} from 'MC/types/Origin';
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
import {Size} from '../types';
import {IRect, Vector2d} from 'konva/lib/types';
import {Project} from "../Project";

export type LayoutShapeConfig = Partial<LayoutAttrs> & ShapeConfig;

export abstract class LayoutShape extends Shape implements ILayoutNode {
  public attrs: LayoutShapeConfig;

  public get project(): Project {
    return <Project>this.getStage();
  }

  public constructor(config?: LayoutShapeConfig) {
    super(config);
    this.on(LAYOUT_CHANGE_EVENT, () => this.handleLayoutChange());
    this.handleLayoutChange();
  }

  public abstract getLayoutSize(custom?: LayoutShapeConfig): Size;

  public setRadius(value: number): this {
    this.attrs.radius = value;
    return this;
  }

  public getRadius(): number {
    return this.attrs.radius ?? 0;
  }

  public setMargin(value: number): this {
    this.attrs.margin = value;
    return this;
  }

  public getMargin(): Origin {
    return this.attrs.margin ?? 0;
  }

  public setPadding(value: number): this {
    this.attrs.padding = value;
    return this;
  }

  public getPadding(): number {
    return this.attrs.padding ?? 0;
  }

  public setColor(value: string): this {
    this.attrs.color = value;
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
