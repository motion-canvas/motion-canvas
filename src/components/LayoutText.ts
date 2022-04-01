import {Text, TextConfig} from 'konva/lib/shapes/Text';
import {IRect, Vector2d} from 'konva/lib/types';
import {ShapeGetClientRectConfig} from 'konva/lib/Shape';
import {
  getOriginDelta,
  getOriginOffset,
  ILayoutNode,
  isInsideLayout,
  LAYOUT_CHANGE_EVENT,
  LayoutAttrs,
} from './ILayoutNode';
import {Origin, Size, PossibleSpacing, Spacing} from '../types';
import {easeInOutCubic, tween, textTween} from '../tweening';

export interface LayoutTextConfig extends Partial<LayoutAttrs>, TextConfig {
  minWidth?: number;
}

export class LayoutText extends Text implements ILayoutNode {
  private overrideWidth: number | null = null;
  private isConstructed = false;

  public constructor(config?: LayoutTextConfig) {
    super({
      padd: new Spacing(30),
      align: 'center',
      verticalAlign: 'middle',
      height: 20,
      fontSize: 28,
      fontFamily: 'JetBrains Mono',
      fill: 'rgba(30, 30, 30, 0.87)',
      ...config,
    });
    this.isConstructed = true;
    this.on(LAYOUT_CHANGE_EVENT, () => this.handleLayoutChange());
    this.handleLayoutChange();
    this.offset(this.getOriginOffset());
  }

  public getLayoutSize(custom?: LayoutTextConfig): Size {
    const padding = this.getPadd();
    const size = this.measureSize(custom?.text ?? this.text());
    return {
      width: Math.max(
        custom?.minWidth ?? this.getMinWidth(),
        this.overrideWidth ?? size.width + padding.x,
      ),
      height: (this.isConstructed ? this.getHeight() : 0) + padding.y,
    };
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

  public setMinWidth(value: number): this {
    this.attrs.minWidth = value;
    this.fireLayoutChange();
    return this;
  }

  public getMinWidth(): number {
    return this.attrs.minWidth ?? 0;
  }

  public setText(text: string): this {
    super.setText(text);
    this.offset(this.getOriginOffset());
    this.fireLayoutChange();

    return this;
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

  public getOriginOffset(custom?: LayoutTextConfig): Vector2d {
    const padding = this.getPadd();
    const size = this.getLayoutSize({minWidth: 0, ...custom});
    const offset = getOriginOffset(size, custom?.origin ?? this.getOrigin());
    offset.x += size.width / 2 - padding.left;
    offset.y += size.height / 2 - padding.top;

    return offset;
  }

  public *animate(text: string) {
    const fromText = this.text();
    const fromWidth = this.getLayoutSize({minWidth: 0}).width;
    const toWidth = this.getLayoutSize({text, minWidth: 0}).width;

    this.overrideWidth = fromWidth;
    yield* tween(0.3, value => {
      this.overrideWidth = easeInOutCubic(value, fromWidth, toWidth);
      this.setText(textTween(fromText, text, easeInOutCubic(value)));
    });
    this.overrideWidth = null;

    this.setText(text);
  }

  public getOriginDelta(newOrigin: Origin, custom?: LayoutTextConfig) {
    return getOriginDelta(
      this.getLayoutSize(custom),
      custom?.origin ?? this.getOrigin(),
      newOrigin,
    );
  }

  public getClientRect(config?: ShapeGetClientRectConfig): IRect {
    const realSize = this.getLayoutSize({minWidth: 0});
    const size = this.getLayoutSize();
    const offset = this.getOriginOffset({origin: Origin.TopLeft});

    const rect: IRect = {
      x: offset.x + (realSize.width - size.width) / 2,
      y: offset.y,
      width: size.width,
      height: size.height,
    };

    if (!config?.skipTransform) {
      return this._transformedRect(rect, config?.relativeTo);
    }

    return rect;
  }

  protected fireLayoutChange() {
    this.getParent()?.fire(LAYOUT_CHANGE_EVENT, undefined, true);
  }

  protected handleLayoutChange() {}
}
