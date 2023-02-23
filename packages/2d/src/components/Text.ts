import {computed, initial, interpolation, signal} from '../decorators';
import {useLogger} from '@motion-canvas/core/lib/utils';
import {textLerp} from '@motion-canvas/core/lib/tweening';
import {Shape, ShapeProps} from './Shape';
import {Rect} from '@motion-canvas/core/lib/types';
import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';
import {View2D} from './View2D';

export interface TextProps extends ShapeProps {
  children?: string;
  text?: SignalValue<string>;
}

export class Text extends Shape {
  protected static segmenter;
  protected static formatter: HTMLDivElement;

  static {
    this.formatter = document.createElement('div');
    View2D.shadowRoot.append(this.formatter);

    try {
      this.segmenter = new (Intl as any).Segmenter(undefined, {
        granularity: 'grapheme',
      });
    } catch (e) {
      // do nothing
    }
  }

  @initial('')
  @interpolation(textLerp)
  @signal()
  public declare readonly text: SimpleSignal<string, this>;

  public constructor({children, ...rest}: TextProps) {
    super(rest);
    if (children) {
      this.text(children);
    }
  }

  protected override draw(context: CanvasRenderingContext2D) {
    this.requestFontUpdate();
    this.applyStyle(context);
    this.applyText(context);
    context.font = this.styles.font;

    const parentRect = this.element.getBoundingClientRect();
    const {width, height} = this.size();
    const range = document.createRange();
    let line = '';
    const lineRect = new Rect();
    for (const childNode of this.element.childNodes) {
      if (!childNode.textContent) {
        continue;
      }

      range.selectNodeContents(childNode);
      const rangeRect = range.getBoundingClientRect();

      const x = width / -2 + rangeRect.left - parentRect.left;
      const y = height / -2 + rangeRect.top - parentRect.top;

      if (lineRect.y === y) {
        lineRect.width += rangeRect.width;
        line += childNode.textContent;
      } else {
        this.drawText(context, line, lineRect);
        lineRect.x = x;
        lineRect.y = y;
        lineRect.width = rangeRect.width;
        lineRect.height = rangeRect.height;
        line = childNode.textContent;
      }
    }

    this.drawText(context, line, lineRect);
  }

  protected drawText(
    context: CanvasRenderingContext2D,
    text: string,
    rect: Rect,
  ) {
    const y = rect.y + rect.height / 2;
    context.save();
    context.textBaseline = 'middle';

    if (this.lineWidth() <= 0) {
      context.fillText(text, rect.x, y);
    } else if (this.strokeFirst()) {
      context.strokeText(text, rect.x, y);
      context.fillText(text, rect.x, y);
    } else {
      context.fillText(text, rect.x, y);
      context.strokeText(text, rect.x, y);
    }

    context.restore();
  }

  @computed()
  protected formattedText() {
    Text.formatter.innerText = this.text();
    return Text.formatter.innerText;
  }

  protected override updateLayout() {
    this.applyFont();
    this.applyFlex();

    const wrap =
      this.styles.whiteSpace !== 'nowrap' && this.styles.whiteSpace !== 'pre';

    if (wrap && Text.segmenter) {
      this.element.innerText = '';
      for (const word of Text.segmenter.segment(this.formattedText())) {
        this.element.appendChild(document.createTextNode(word.segment));
      }
    } else if (this.styles.whiteSpace === 'pre') {
      this.element.innerText = '';
      for (const line of this.text().split('\n')) {
        this.element.appendChild(document.createTextNode(line + '\n'));
      }
    } else {
      this.element.innerText = this.formattedText();
    }

    if (wrap && !Text.segmenter) {
      useLogger().warn({
        message: 'Wrapping is not supported',
        inspect: this.key,
      });
    }
  }
}
