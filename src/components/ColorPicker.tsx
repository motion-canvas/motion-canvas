import {LinearLayout, LinearLayoutConfig} from './LinearLayout';
import {Rect} from 'konva/lib/shapes/Rect';
import {Range, RangeConfig} from './Range';
import {getset, KonvaNode} from '../decorators';
import {parseColor} from 'mix-color';
import {Surface} from './Surface';
import {Origin} from '../types';
import {Style} from '../styles';
import {GetSet} from 'konva/lib/types';
import {clampRemap} from '../tweening';
import {useScene} from '../utils';

export interface ColorPickerConfig extends LinearLayoutConfig {
  previewColor?: string;
  dissolve?: number;
  style?: Style;
}

const colorRangeConfig: RangeConfig = {
  width: 280,
  height: 60,
  range: [0, 255],
  precision: 0,
  margin: [10, 40],
  value: 0,
};

@KonvaNode()
export class ColorPicker extends Surface {
  @getset(null)
  public style: GetSet<ColorPickerConfig['style'], this>;
  @getset('#000000', ColorPicker.prototype.updateColor)
  public previewColor: GetSet<ColorPickerConfig['previewColor'], this>;
  @getset(0, ColorPicker.prototype.updateDissolve)
  public dissolve: GetSet<ColorPickerConfig['dissolve'], this>;

  public readonly preview: Rect;
  public readonly r: Range;
  public readonly g: Range;
  public readonly b: Range;
  public readonly a: Range;

  public parsedColor: ReturnType<typeof parseColor>;

  public constructor(config?: ColorPickerConfig) {
    super(config);

    this.setChild(
      <LinearLayout origin={Origin.Top}>
        <Rect
          ref={[this, 'preview']}
          width={360}
          height={200}
          fill={'yellow'}
          cornerRadius={[8, 8, 0, 0]}
        />
        <Range
          ref={[this, 'r']}
          {...colorRangeConfig}
          label={'R:'}
          margin={[40, 40, 10]}
        />
        <Range ref={[this, 'g']} {...colorRangeConfig} label={'G:'} />
        <Range ref={[this, 'b']} {...colorRangeConfig} label={'B:'} />
        <Range
          ref={[this, 'a']}
          {...colorRangeConfig}
          label={'A:'}
          margin={[10, 40, 40]}
        />
      </LinearLayout>,
    );

    this.updateColor();
    this.updateDissolve();
  }

  private updateColor() {
    if (!this.a) return;

    const style = this.style();
    const preview = this.previewColor();

    this.style({
      ...style,
      foreground: preview,
    });
    this.parsedColor = parseColor(preview);
    this.parsedColor.a = Math.round(this.parsedColor.a * 255);

    this.r.value(this.parsedColor.r);
    this.g.value(this.parsedColor.g);
    this.b.value(this.parsedColor.b);
    this.a.value(this.parsedColor.a);
    this.preview.fill(preview);
  }

  public setStyle(value: Style): this {
    this.attrs.style = value;
    this.background(value.background);
    return this;
  }

  private updateDissolve() {
    if (!this.r) return;

    const opacity = clampRemap(0, 0.5, 1, 0, this.dissolve());
    this.r.opacity(opacity);
    this.g.opacity(opacity);
    this.b.opacity(opacity);
    this.a.opacity(opacity);
    this.markDirty();
  }

  public recalculateLayout() {
    if (this.preview) {
      const rangeWidth = this.preview.width() - 80;
      this.r.width(rangeWidth);
      this.g.width(rangeWidth);
      this.b.width(rangeWidth);
      this.a.width(rangeWidth);
    }
    super.recalculateLayout();
  }
}
