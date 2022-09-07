import {Text, TextConfig} from 'konva/lib/shapes/Text';
import {GetSet, IRect, Vector2d} from 'konva/lib/types';
import {ShapeGetClientRectConfig} from 'konva/lib/Shape';
import {
  Origin,
  Size,
  Spacing,
  getOriginOffset,
} from '@motion-canvas/core/lib/types';
import {
  Animator,
  tween,
  textLerp,
  TimingFunction,
} from '@motion-canvas/core/lib/tweening';
import {threadable} from '@motion-canvas/core/lib/decorators';
import {getset} from '../decorators';

export interface LayoutTextConfig extends TextConfig {
  minWidth?: number;
}

export class LayoutText extends Text {
  @getset('', undefined, LayoutText.prototype.textTween)
  public text: GetSet<LayoutTextConfig['text'], this>;

  private overrideWidth: number | null = null;
  private isConstructed = false;

  public constructor(config?: LayoutTextConfig) {
    super({
      padd: new Spacing(30),
      align: 'center',
      verticalAlign: 'middle',
      fontSize: 28,
      fontFamily: 'JetBrains Mono',
      fill: 'rgba(30, 30, 30, 0.87)',
      ...config,
    });
    this.isConstructed = true;
  }

  public getLayoutSize(custom?: LayoutTextConfig): Size {
    const padding = this.getPadd();
    let size: Size;
    if (custom?.text) {
      const text = this.text();
      this.text(custom.text);
      size = {
        width: this.textWidth,
        height: this.textHeight,
      };
      this.text(text);
    } else {
      size = {
        width: this.textWidth,
        height: this.textHeight,
      };
    }

    return {
      width: Math.max(
        custom?.minWidth ?? this.getMinWidth(),
        this.overrideWidth ?? size.width + padding.x,
      ),
      height: this.height() + padding.y,
    };
  }

  public setMinWidth(value: number): this {
    this.attrs.minWidth = value;
    this.markDirty();
    return this;
  }

  public getMinWidth(): number {
    return this.attrs.minWidth ?? 0;
  }

  public setText(text: string): this {
    super.setText(text);
    this.markDirty();
    return this;
  }

  public getOriginOffset(custom?: LayoutTextConfig): Vector2d {
    const padding = this.getPadd();
    const size = this.getLayoutSize({minWidth: 0, ...custom});
    const offset = getOriginOffset(size, custom?.origin ?? this.getOrigin());
    offset.x += size.width / 2 - padding.left;
    offset.y += size.height / 2 - padding.top;

    return offset;
  }

  public get animate(): Animator<string, this> {
    return new Animator<string, this>(this, 'text', this.textTween);
  }

  @threadable()
  private *textTween(
    fromText: string,
    text: string,
    time: number,
    timingFunction: TimingFunction,
    onEnd: Callback,
  ) {
    const fromWidth = this.getLayoutSize({text: fromText, minWidth: 0}).width;
    const toWidth = this.getLayoutSize({text, minWidth: 0}).width;

    this.overrideWidth = fromWidth;
    yield* tween(time, value => {
      this.overrideWidth = timingFunction(value, fromWidth, toWidth);
      this.setText(textLerp(fromText, text, timingFunction(value)));
    });
    this.overrideWidth = null;

    this.setText(text);
    onEnd();
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
}
