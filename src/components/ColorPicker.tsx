import {LinearLayout, LinearLayoutConfig} from './LinearLayout';
import {Rect} from 'konva/lib/shapes/Rect';
import {Range, RangeConfig} from './Range';
import {AnimatedGetSet, getset, KonvaNode} from '../decorators';
import {parseColor} from 'mix-color';
import {TimeTween} from '../animations';
import {Surface} from './Surface';
import {Origin} from '../types';
import {Style} from '../styles';
import {GetSet} from 'konva/lib/types';

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
  margin: 10,
  value: 0,
};

@KonvaNode()
export class ColorPicker extends Surface {
  @getset(null)
  public style: GetSet<ColorPickerConfig['style'], this>;
  @getset('#000000', ColorPicker.prototype.updateColor)
  public previewColor: AnimatedGetSet<ColorPickerConfig['previewColor'], this>;
  @getset(0, ColorPicker.prototype.updateDissolve)
  public dissolve: AnimatedGetSet<ColorPickerConfig['dissolve'], this>;

  public readonly preview: Rect;
  public readonly r: Range;
  public readonly g: Range;
  public readonly b: Range;
  public readonly a: Range;

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
          margin={[40, 10, 10]}
        />
        <Range ref={[this, 'g']} {...colorRangeConfig} label={'G:'} />
        <Range ref={[this, 'b']} {...colorRangeConfig} label={'B:'} />
        <Range
          ref={[this, 'a']}
          {...colorRangeConfig}
          label={'A:'}
          margin={[10, 10, 40]}
        />
      </LinearLayout>,
    );

    this.updateColor();
    this.updateDissolve();
  }

  private updateColor() {
    const style = this.style();
    const preview = this.previewColor();

    this.style({
      ...style,
      foreground: preview,
    });
    const color = parseColor(preview);
    color.a = Math.round(color.a * 255);

    this.r.value(color.r);
    this.g.value(color.g);
    this.b.value(color.b);
    this.a.value(color.a);
    this.preview.fill(preview);
  }

  public setStyle(value: Style): this {
    this.attrs.style = value;
    this.background(value.background);
    return this;
  }

  private updateDissolve() {
    if (!this.r) return;

    const opacity = TimeTween.clampRemap(0, 0.5, 1, 0, this.dissolve());
    this.r.opacity(opacity);
    this.g.opacity(opacity);
    this.b.opacity(opacity);
    this.a.opacity(opacity);

    this.fireLayoutChange();
  }

  protected handleLayoutChange() {
    if (this.preview) {
      const rangeWidth = this.preview.width() - 80;
      this.r.width(rangeWidth);
      this.g.width(rangeWidth);
      this.b.width(rangeWidth);
      this.a.width(rangeWidth);
    }
    super.handleLayoutChange();
  }
}
