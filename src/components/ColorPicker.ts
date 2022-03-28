import {LinearLayout, LinearLayoutConfig} from 'MC/components/LinearLayout';
import {Rect} from 'konva/lib/shapes/Rect';
import {Range, RangeConfig} from 'MC/components/Range';
import {Node} from 'konva/lib/Node';
import {AnimatedGetSet, getset} from '../decorators';
import mixColor, {parseColor} from 'mix-color';
import {TimeTween} from '../animations';

export interface ColorPickerConfig extends LinearLayoutConfig {
  previewColor?: string;
  dissolve?: number;
}

const colorRangeConfig: RangeConfig = {
  width: 280,
  height: 60,
  range: [0, 255],
  precision: 0,
  margin: 10,
  value: 0,
};

export class ColorPicker extends LinearLayout {
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

    this.preview = new Rect({
      width: 360,
      height: 200,
      fill: 'yellow',
      cornerRadius: [8, 8, 0, 0],
    });
    this.r = new Range({
      ...colorRangeConfig,
      label: 'R:',
      margin: [40, 10, 10],
    });
    this.g = new Range({
      ...colorRangeConfig,
      label: 'G:',
    });
    this.b = new Range({
      ...colorRangeConfig,
      label: 'B:',
    });
    this.a = new Range({
      ...colorRangeConfig,
      label: 'A:',
      margin: [10, 10, 40],
    });

    this.add(this.preview, this.r, this.g, this.b, this.a);
    this.updateColor();
    this.updateDissolve();
  }

  private updateColor() {
    const color = parseColor(this.previewColor());
    color.a = Math.round(color.a * 255);

    this.r.value(color.r);
    this.g.value(color.g);
    this.b.value(color.b);
    this.a.value(color.a);
    this.r.foregroundColor(this.previewColor());
    this.g.foregroundColor(this.previewColor());
    this.b.foregroundColor(this.previewColor());
    this.a.foregroundColor(this.previewColor());
    this.preview.fill(this.previewColor());
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

  getColor(): string {
    return mixColor(
      super.getColor(),
      this.previewColor(),
      TimeTween.clampRemap(0.5, 1, 0, 1, this.dissolve()),
    );
  }

  clone(obj?: any): this {
    return Node.prototype.clone.call(this, obj);
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
