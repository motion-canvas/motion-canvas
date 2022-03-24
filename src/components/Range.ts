import {LayoutShape, LayoutShapeConfig} from './LayoutShape';
import {Context} from 'konva/lib/Context';
import {GetSet} from 'konva/lib/types';
import {getset, KonvaNode} from 'MC/decorators';
import {CanvasHelper} from 'MC/helpers';
import {TimeTween} from 'MC/animations';

export interface RangeConfig extends LayoutShapeConfig {
  range?: [number, number];
  value?: number;
  precision?: number;
  backgroundColor?: string;
  foregroundColor?: string;
  textColor?: string;
  label?: string;
}

@KonvaNode()
export class Range extends LayoutShape {
  @getset([0, 1])
  public range: GetSet<RangeConfig['range'], this>;
  @getset(0.5)
  public value: GetSet<RangeConfig['value'], this>;
  @getset(0)
  public precision: GetSet<RangeConfig['precision'], this>;
  @getset('#141414')
  public backgroundColor: GetSet<RangeConfig['backgroundColor'], this>;
  @getset('rgba(255, 255, 255, 0.24)')
  public foregroundColor: GetSet<RangeConfig['foregroundColor'], this>;
  @getset('rgba(255, 255, 255, 0.54')
  public textColor: GetSet<RangeConfig['textColor'], this>;
  @getset(null)
  public label: GetSet<RangeConfig['label'], this>;

  public constructor(config?: RangeConfig) {
    super(config);
  }

  public _sceneFunc(context: Context) {
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

    const position = {
      x: size.width / -2,
      y: size.height / -2,
    }

    if (label) {
      position.x += 60;
      size.width -= 60;
    }

    ctx.fillStyle = this.backgroundColor();
    CanvasHelper.roundRect(
      ctx,
      position.x,
      position.y,
      size.width,
      size.height,
      8,
    );
    ctx.fill();

    const width = TimeTween.remap(range[0], range[1], 16, size.width, value);
    ctx.fillStyle = this.foregroundColor();
    CanvasHelper.roundRect(
      ctx,
      position.x,
      position.y,
      width,
      size.height,
      8,
    );
    ctx.fill();

    ctx.fillStyle = this.textColor();
    ctx.font = 'bold 28px "JetBrains Mono"';
    ctx.fillText(text, position.x + 20, 10);

    if (label) {
      ctx.fillText(label, position.x - 60, 10);
    }
  }
}
