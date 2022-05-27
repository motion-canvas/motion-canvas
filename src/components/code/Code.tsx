import {getset, KonvaNode, threadable} from '../../decorators';
import {GetSet} from 'konva/lib/types';
import PrismJS from 'prismjs';
import {Context} from 'konva/lib/Context';
import {Text, TextConfig} from 'konva/lib/shapes/Text';
import {Util} from 'konva/lib/Util';
import {easeOutExpo, tween} from '../../tweening';
import {CodeTheme} from './CodeTheme';
import {JS_CODE_THEME} from '../../themes';

type CodePoint = [number, number];
type CodeRange = [CodePoint, CodePoint];

interface CodeConfig extends TextConfig {
  selection?: CodeRange[];
  theme?: CodeTheme;
}

@KonvaNode({centroid: false})
export class Code extends Text {
  @getset([])
  public selection: GetSet<CodeConfig['selection'], this>;
  @getset(JS_CODE_THEME)
  public theme: GetSet<CodeConfig['theme'], this>;

  private readonly textCanvas: HTMLCanvasElement;
  private readonly textCtx: CanvasRenderingContext2D;
  private readonly selectionCanvas: HTMLCanvasElement;
  private readonly selectionCtx: CanvasRenderingContext2D;

  private outline: number = 0;
  private unselectedOpacity = 1;

  public constructor(config?: CodeConfig) {
    super({
      fontFamily: 'JetBrains Mono',
      fontSize: 28,
      lineHeight: 2,
      ...config,
    });
    this.textCanvas = Util.createCanvasElement();
    this.textCtx = this.textCanvas.getContext('2d');
    this.selectionCanvas = Util.createCanvasElement();
    this.selectionCtx = this.selectionCanvas.getContext('2d');
  }

  public _sceneFunc(context: Context) {
    const padding = this.getPadd();

    context.translate(padding.left, padding.right);
    this.drawSelection(context._context);
    this.drawText(context._context);
  }

  private drawSelection(context: CanvasRenderingContext2D) {
    const lines = this.text().split('\n');
    const letterWidth = this.measureSize(' ').width;
    const lineHeight = this.fontSize() * this.lineHeight();
    const selection = [...this.selection()];
    const outline = this.outline;

    context.beginPath();
    for (const range of selection) {
      let [[startLine, startColumn], [endLine, endColumn]] = range;

      if (startLine >= lines.length) {
        startLine = lines.length - 1;
      }

      if (endLine >= lines.length) {
        endLine = lines.length - 1;
      }

      if (endColumn >= lines[endLine].length) {
        endColumn = Math.max(lines[endLine].length, 1);
      }

      if (startLine !== endLine) {
        const nextLineOffset =
          startLine + 1 === endLine
            ? endColumn
            : Math.max(1, lines[startLine + 1].length);

        if (nextLineOffset <= startColumn) {
          selection.push([
            [startLine + 1, 0],
            [endLine, endColumn],
          ]);
          endLine = startLine;
          endColumn = lines[startLine].length;
        }
      }

      let offset =
        startLine === endLine
          ? endColumn * letterWidth
          : Math.max(1, lines[startLine].length) * letterWidth;
      context.moveTo(
        startColumn * letterWidth - outline,
        (startLine + 0.5) * lineHeight,
      );
      context.arcTo(
        startColumn * letterWidth - outline,
        startLine * lineHeight - outline,
        offset + outline,
        startLine * lineHeight - outline,
        8,
      );

      context.arcTo(
        offset + outline,
        startLine * lineHeight - outline,
        offset + outline,
        (startLine + 1) * lineHeight,
        8,
      );

      for (let i = startLine + 1; i <= endLine; i++) {
        const lineOffset =
          Math.max(1, i === endLine ? endColumn : lines[i].length) *
          letterWidth;
        const linePadding = lineOffset > offset ? -outline : outline;
        context.arcTo(
          offset + outline,
          i * lineHeight + linePadding,
          lineOffset + outline,
          i * lineHeight + linePadding,
          8,
        );
        offset = lineOffset;
        context.arcTo(
          offset + outline,
          i * lineHeight + linePadding,
          offset + outline,
          (i + 1) * lineHeight + linePadding,
          8,
        );
      }

      const endOffset = startLine === endLine ? startColumn * letterWidth : 0;
      context.arcTo(
        offset + outline,
        (endLine + 1) * lineHeight + outline,
        endOffset - outline,
        (endLine + 1) * lineHeight + outline,
        8,
      );
      context.arcTo(
        endOffset - outline,
        (endLine + 1) * lineHeight + outline,
        endOffset - outline,
        endLine * lineHeight + outline,
        8,
      );
      if (startLine !== endLine) {
        context.arcTo(
          endOffset - outline,
          (startLine + 1) * lineHeight - outline,
          startColumn * letterWidth - outline,
          (startLine + 1) * lineHeight - outline,
          8,
        );
        context.arcTo(
          startColumn * letterWidth - outline,
          (startLine + 1) * lineHeight - outline,
          startColumn * letterWidth - outline,
          startLine * lineHeight - outline,
          8,
        );
      }
      context.lineTo(
        startColumn * letterWidth - outline,
        (startLine + 0.5) * lineHeight,
      );
    }

    context.closePath();
    context.fillStyle = '#242424';
    context.fill();
  }

  private drawText(context: CanvasRenderingContext2D) {
    const letterWidth = this.measureSize(' ').width;
    const lineHeight = this.fontSize() * this.lineHeight();
    const tokens = PrismJS.tokenize(this.text(), PrismJS.languages.javascript);
    const theme = this.theme();

    context.font = this._getContextFont();
    context.textBaseline = 'middle';

    let x = 0;
    let y = 0;
    for (const token of tokens) {
      if (typeof token === 'string') {
        context.fillStyle = theme.punctuation ?? theme.fallback;
        if (token.includes('\n')) {
          const words = token.split('\n');
          for (let i = 0; i < words.length; i++) {
            if (i > 0) {
              x = 0;
              y++;
            }

            context.globalAlpha = this.getOpacity(x, y);
            context.fillText(words[i], x * letterWidth, (y + 0.5) * lineHeight);
            x += words[i].length;
          }
        } else {
          context.globalAlpha = this.getOpacity(x, y);
          context.fillText(
            token as string,
            x * letterWidth,
            (y + 0.5) * lineHeight,
          );
          x += token.length;
        }
      } else {
        context.fillStyle = theme[token.type] ?? theme.fallback;
        context.globalAlpha = this.getOpacity(x, y);
        context.fillText(
          token.content as string,
          x * letterWidth,
          (y + 0.5) * lineHeight,
        );
        x += token.length;
      }
    }
  }

  private getOpacity(x: number, y: number): number {
    return this.isSelected(x, y) ? 1 : this.unselectedOpacity;
  }

  private isSelected(x: number, y: number): boolean {
    if (this.selection().length === 0) {
      return false;
    }

    return !!this.selection().find(
      ([[startLine, startColumn], [endLine, endColumn]]) => {
        return (
          ((y === startLine && x >= startColumn) || y > startLine) &&
          ((y === endLine && x < endColumn) || y < endLine)
        );
      },
    );
  }

  public selectLines(from: number, to?: number): this {
    this.selection([
      [
        [from, 0],
        [to ?? from, Infinity],
      ],
    ]);
    return this;
  }

  public selectWord(line: number, from: number, to?: number): this {
    this.selection([
      [
        [line, from],
        [line, to ?? Infinity],
      ],
    ]);
    return this;
  }

  public selectRange(
    startLine: number,
    startColumn: number,
    endLine: number,
    endColumn: number,
  ): this {
    this.selection([
      [
        [startLine, startColumn],
        [endLine, endColumn],
      ],
    ]);
    return this;
  }

  public clearSelection(): this {
    this.selection([]);
    return this;
  }

  public hasSelection(): boolean {
    return this.selection().length > 0;
  }

  public apply() {
    this.outline = 0;
    this.unselectedOpacity = this.hasSelection() ? 0.32 : 1;
  }

  @threadable('animateCode')
  public *animate() {
    const hasSelection = this.hasSelection();
    const currentOpacity = this.unselectedOpacity;

    yield* tween(
      0.5,
      value => {
        this.outline = easeOutExpo(value, -8, 0);
        this.unselectedOpacity = easeOutExpo(
          value,
          currentOpacity,
          hasSelection ? 0.32 : 1,
        );
      },
      () => this.apply(),
    );
  }
}
