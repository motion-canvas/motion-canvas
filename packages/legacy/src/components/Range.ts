import {Context} from 'konva/lib/Context';
import {KonvaNode, getset} from '../decorators';
import {CanvasHelper} from '../helpers';
import {GetSet} from 'konva/lib/types';
import {getFontColor, getStyle, Style} from '../styles';
import {remap} from '@motion-canvas/core/lib/tweening';
import {Shape, ShapeConfig} from 'konva/lib/Shape';

export interface RangeConfig extends ShapeConfig {
  range?: [number, number];
  value?: number;
  precision?: number;
  label?: string;
  style?: Style;
}

@KonvaNode()
export class Range extends Shape {
  @getset(null)
  public style: GetSet<RangeConfig['style'], this>;
  @getset([0, 1])
  public range: GetSet<RangeConfig['range'], this>;
  @getset(0.5)
  public value: GetSet<RangeConfig['value'], this>;
  @getset(0)
  public precision: GetSet<RangeConfig['precision'], this>;
  @getset(null)
  public label: GetSet<RangeConfig['label'], this>;

  public constructor(config?: RangeConfig) {
    super(config);
  }

  public _sceneFunc(context: Context) {
    const style = getStyle(this);

    const ctx = context._context;
    const size = this.getSize();
    const value = this.value();
    const range = this.range();
    const precision = this.precision();
    const label = this.label();
    const text = value.toLocaleString('en-EN', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });
    const minText = range[0].toLocaleString('en-EN', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });

    const position = {
      x: size.width / -2,
      y: size.height / -2,
    };

    if (label) {
      position.x += 60;
      size.width -= 60;
    }

    ctx.fillStyle = style.backgroundLight;
    CanvasHelper.roundRect(
      ctx,
      position.x,
      position.y,
      size.width,
      size.height,
      8,
    );
    ctx.fill();

    ctx.font = style.bodyFont;
    const textSize = ctx.measureText(minText);

    const width = remap(
      range[0],
      range[1],
      textSize.width + 40,
      size.width,
      value,
    );
    ctx.fillStyle = style.foreground;
    CanvasHelper.roundRect(ctx, position.x, position.y, width, size.height, 8);
    ctx.fill();

    ctx.font = style.bodyFont;
    ctx.fillStyle = getFontColor(style.foreground);
    ctx.fillText(text, position.x + 20, 10);

    if (label) {
      ctx.fillStyle = getFontColor(style.backgroundLight);
      ctx.fillText(label, position.x - 60, 10);
    }
  }

  public _hitFunc(context: Context) {
    const size = this.getSize();
    const position = {
      x: size.width / -2,
      y: size.height / -2,
    };

    context.beginPath();
    context.rect(position.x, position.y, size.width, size.height);
    context.closePath();
    context.fillShape(this);
  }
}
