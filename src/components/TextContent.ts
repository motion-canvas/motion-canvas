import {Text, TextConfig} from 'konva/lib/shapes/Text';
import {GetSet, Vector2d} from 'konva/lib/types';
import {ISurfaceChild, SURFACE_CHANGE_EVENT, SurfaceData} from './Surface';
import {ShapeGetClientRectConfig} from 'konva/lib/Shape';
import {_registerNode} from 'konva/lib/Global';
import {Factory} from 'konva/lib/Factory';
import {getNumberValidator} from 'konva/lib/Validators';
import {Project} from 'MC/Project';

export interface TextContentConfig extends TextConfig {
  minWidth?: number;
}

export class TextContent extends Text implements ISurfaceChild {
  private contentOffset = 0;

  public get project(): Project {
    return <Project>this.getStage();
  }

  public constructor(config?: TextContentConfig) {
    super({
      ...config,
      x: 0,
      y: 0,
      height: 80,
      fontSize: 28,
      verticalAlign: 'middle',
      fontFamily: 'JetBrains Mono',
      fill: 'rgba(30, 30, 28, 0.87)',
    });

    this.recalculate();
  }

  getSurfaceData(): SurfaceData {
    return {
      ...this.getClientRect(),
      radius: 40,
      color: '#c0b3a3',
    };
  }

  public setText(text: string): this {
    super.setText(text);
    this.recalculate();

    return this;
  }

  public *animateText(text: string) {
    const fromText = this.text();
    const from = this.recalculateValues(fromText);
    const to = this.recalculateValues(text);

    yield* this.project.tween(0.3, value => {
      this.text(value.text(fromText, text, value.easeInOutCubic()));
      this.width(value.easeInOutCubic(from.width, to.width));
      this.offset(
        value.vector2d(from.offset, to.offset, value.easeInOutCubic()),
      );
      this.contentOffset = value.easeInOutCubic(
        from.contentOffset,
        to.contentOffset,
      );
      this.fire(SURFACE_CHANGE_EVENT, undefined, true);
    });

    this.recalculate();
  }

  private recalculate() {
    const values = this.recalculateValues(this.text());

    this.offset(values.offset);
    this.width(values.width);
    this.contentOffset = values.contentOffset;
    this.fire(SURFACE_CHANGE_EVENT, undefined, true);
  }

  private recalculateValues(text: string) {
    const minWidth = this.attrs.minWidth ?? 0;
    const size = this.measureSize(text);
    const textWidth = Math.max(minWidth, size.width);
    const boxWidth = Math.ceil((textWidth + 80) / 20) * 20;

    return {
      width: boxWidth,
      offset: <Vector2d>{x: textWidth / 2, y: 38},
      contentOffset: (boxWidth - textWidth) / 2,
    };
  }

  getClientRect(config?: ShapeGetClientRectConfig): {
    width: number;
    height: number;
    x: number;
    y: number;
  } {
    const rect = super.getClientRect(config);
    rect.x -= this.contentOffset;
    return rect;
  }

  public minWidth: GetSet<number, this>;
}

TextContent.prototype.className = 'TextContent';
_registerNode(TextContent);

Factory.addGetterSetter(
  TextContent,
  'minWidth',
  0,
  getNumberValidator(),
  // @ts-ignore
  TextContent.prototype.recalculate,
);
