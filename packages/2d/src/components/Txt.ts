import {computed, initial, interpolation, signal} from '../decorators';
import {useLogger} from '@motion-canvas/core/lib/utils';
import {textLerp} from '@motion-canvas/core/lib/tweening';
import {Shape, ShapeProps} from './Shape';
import {BBox} from '@motion-canvas/core/lib/types';
import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';
import {View2D} from './View2D';
import {lazy} from '@motion-canvas/core/lib/decorators';

export interface TxtProps extends ShapeProps {
  children?: string;
  text?: SignalValue<string>;
}

export class Txt extends Shape {
  @lazy(() => {
    const formatter = document.createElement('div');
    View2D.shadowRoot.append(formatter);
    return formatter;
  })
  protected static readonly segmenter: any;

  @lazy(() => {
    try {
      return new (Intl as any).Segmenter(undefined, {
        granularity: 'grapheme',
      });
    } catch (e) {
      return null;
    }
  })
  protected static formatter: HTMLDivElement;

  @initial('')
  @interpolation(textLerp)
  @signal()
  public declare readonly text: SimpleSignal<string, this>;

  public constructor({children, ...rest}: TxtProps) {
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
    if ('letterSpacing' in context) {
      context.letterSpacing = `${this.letterSpacing()}px`;
    }

    const parentRect = this.element.getBoundingClientRect();
    const {width, height} = this.size();
    const range = document.createRange();
    let line = '';
    const lineRect = new BBox();
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
    box: BBox,
  ) {
    const y = box.y + box.height / 2;
    context.save();
    context.textBaseline = 'middle';
    const clipPath = new Path2D();
    clipPath.rect(box.x, box.y, box.width, this.getHeight());
    context.clip(clipPath);

    if (this.lineWidth() <= 0) {
      context.fillText(text, box.x, y);
    } else if (this.strokeFirst()) {
      context.strokeText(text, box.x, y);
      context.fillText(text, box.x, y);
    } else {
      context.fillText(text, box.x, y);
      context.strokeText(text, box.x, y);
    }

    context.restore();
  }

  @computed()
  protected formattedText() {
    Txt.formatter.innerText = this.text();
    return Txt.formatter.innerText;
  }

  protected override updateLayout() {
    this.applyFont();
    this.applyFlex();

    // Make sure the text is aligned correctly even if the text is smaller than
    // the container.
    if (this.justifyContent.isInitial()) {
      this.element.style.justifyContent =
        this.styles.getPropertyValue('text-align');
    }

    const wrap =
      this.styles.whiteSpace !== 'nowrap' && this.styles.whiteSpace !== 'pre';

    if (wrap && Txt.segmenter) {
      this.element.innerText = '';
      for (const word of Txt.segmenter.segment(this.formattedText())) {
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

    if (wrap && !Txt.segmenter) {
      useLogger().warn({
        message: 'Wrapping is not supported',
        inspect: this.key,
      });
    }
  }
}
