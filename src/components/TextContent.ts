import {Text} from 'konva/lib/shapes/Text';
import {GetSet, Vector2d} from 'konva/lib/types';
import {Shape} from 'konva/lib/Shape';
import {Factory} from 'konva/lib/Factory';
import {getNumberValidator} from 'konva/lib/Validators';
import {Project} from '../Project';
import {LayoutGroup, LayoutGroupConfig} from './LayoutGroup';
import {Group} from 'konva/lib/Group';
import {Size} from '../types';

export interface TextContentConfig extends LayoutGroupConfig {
  minWidth?: number;
  text?: string;
}

export class TextContent extends LayoutGroup {
  public minWidth: GetSet<number, this>;

  private text: Text;

  public get project(): Project {
    return <Project>this.getStage();
  }

  public constructor(config?: TextContentConfig) {
    super({
      color: '#c0b3a3',
      radius: 40,
      height: 80,
      ...config,
    });
    this.add(
      new Text({
        name: 'text',
        height: 80,
        fontSize: 28,
        text: config.text,
        verticalAlign: 'middle',
        fontFamily: 'JetBrains Mono',
        fill: 'rgba(30, 30, 30, 0.87)',
      }),
    );
  }

  add(...children: (Shape | Group)[]): this {
    super.add(...children);
    const text = children.find<Text>((child): child is Text =>
      child.hasName('text'),
    );

    if (text) {
      this.text?.destroy();
      this.text = text;
      this.text?.text(this.getText());
      this.handleLayoutChange();
    }

    return this;
  }

  getLayoutSize(): Size {
    return this.getSize();
  }

  public setText(value: string): this {
    this.text?.setText(value);
    this.attrs.text = value;
    this.handleLayoutChange();
    return this;
  }

  public getText(): string {
    return this.attrs.text ?? '';
  }

  public *animateText(text: string) {
    const fromText = this.text.text();
    const from = this.recalculateValues(fromText);
    const to = this.recalculateValues(text);

    yield* this.project.tween(0.3, value => {
      this.text.setText(value.text(fromText, text, value.easeInOutCubic()));
      this.width(value.easeInOutCubic(from.width, to.width));
      this.text.offset(
        value.vector2d(from.offset, to.offset, value.easeInOutCubic()),
      );
      this.fireLayoutChange();
    });

    this.setText(text);
  }

  protected handleLayoutChange() {
    if (!this.text) return;

    const values = this.recalculateValues(this.text.text());
    this.text.offset(values.offset);
    this.width(values.width);
    this.fireLayoutChange();
  }

  private recalculateValues(text: string) {
    const minWidth = this.minWidth();
    const size = this.text.measureSize(text);
    const textWidth = Math.max(minWidth, size.width);
    const boxWidth = Math.ceil((textWidth + 80) / 20) * 20;

    return {
      width: boxWidth,
      offset: <Vector2d>{x: size.width / 2, y: 38},
    };
  }
}

Factory.addGetterSetter(
  TextContent,
  'minWidth',
  0,
  getNumberValidator(),
  // @ts-ignore
  TextContent.prototype.recalculate,
);
