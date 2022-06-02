import {cached, getset, KonvaNode, threadable} from '../../decorators';
import {GetSet} from 'konva/lib/types';
import PrismJS from 'prismjs';
import {Context} from 'konva/lib/Context';
import {Text, TextConfig} from 'konva/lib/shapes/Text';
import {Util} from 'konva/lib/Util';
import {easeInExpo, easeOutExpo, tween} from '../../tweening';
import {CodeTheme, CodeTokens} from './CodeTheme';
import {JS_CODE_THEME} from '../../themes';
import {ThreadGenerator} from '../../threading';
import {useScene} from '../../utils';
import {Node} from 'konva/lib/Node';

type CodePoint = [number, number];
type CodeRange = [CodePoint, CodePoint];

interface CodeConfig extends TextConfig {
  selection?: CodeRange[];
  theme?: CodeTheme;
  numbers?: boolean;
  language?: string;
}

const FALLBACK_COLOR = '#FF00FF';

@KonvaNode({centroid: false})
export class Code extends Text {
  @getset([])
  public selection: GetSet<CodeConfig['selection'], this>;
  @getset(JS_CODE_THEME)
  public theme: GetSet<CodeConfig['theme'], this>;
  @getset(false)
  public numbers: GetSet<CodeConfig['numbers'], this>;
  @getset('js')
  public language: GetSet<CodeConfig['language'], this>;

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
    if (this.numbers()) {
      this.drawLineNumbers(context._context);
    }
  }

  public setText(text: any): this {
    super.setText(text);
    this.markDirty();

    this._clearCache(this.getLines);
    this._clearCache(this.getTokens);
    this._clearCache(this.getNormalizedSelection);
    return this;
  }

  public setLanguage(langauge: string): this {
    this.attrs.language = langauge;
    this._clearCache(this.getTokens);
    return this;
  }

  public setSelection(value: CodeRange[]): this {
    this.attrs.selection = value;
    this._clearCache(this.getNormalizedSelection);
    return this;
  }

  @cached('Code.lines')
  private getLines(): string[] {
    return this.text().split('\n');
  }

  @cached('Code.tokens')
  private getTokens(): (PrismJS.Token | string)[] {
    const language = this.language();
    if (language in PrismJS.languages) {
      return PrismJS.tokenize(this.text(), PrismJS.languages[language]);
    } else {
      console.warn(
        `Missing language: ${language}.`,
        `Make sure that 'prismjs/components/prism-${language}' has been imported.`,
      );
      return PrismJS.tokenize(this.text(), PrismJS.languages.plain);
    }
  }

  @cached('Code.selection')
  private getNormalizedSelection(): CodeRange[] {
    const lines = this.getLines();
    const normalized: CodeRange[] = [];
    const selection = [...this.selection()];
    for (const range of selection) {
      let [[startLine, startColumn], [endLine, endColumn]] = range;
      if (startLine > endLine) {
        [startLine, endLine] = [endLine, startLine];
      }
      if (startLine === endLine && startColumn > endColumn) {
        [startColumn, endColumn] = [endColumn, startColumn];
      }

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
          normalized.push([
            [startLine + 1, 0],
            [endLine, endColumn],
          ]);
          endLine = startLine;
          endColumn = lines[startLine].length;
        }
      }

      normalized.push([
        [startLine, startColumn],
        [endLine, endColumn],
      ]);
    }

    return normalized;
  }

  private drawSelection(context: CanvasRenderingContext2D) {
    const letterWidth = this.measureSize(' ').width;
    const lineHeight = this.fontSize() * this.lineHeight();
    const selection = this.getNormalizedSelection();
    const outline = this.outline;
    const lines = this.getLines();

    context.beginPath();
    for (const range of selection) {
      let [[startLine, startColumn], [endLine, endColumn]] = range;
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
    context.globalAlpha = this.getAbsoluteOpacity();
    context.fill();
  }

  private drawText(context: CanvasRenderingContext2D) {
    const letterWidth = this.measureSize(' ').width;
    const lineHeight = this.fontSize() * this.lineHeight();
    const theme = this.theme();

    context.font = this._getContextFont();
    context.textBaseline = 'middle';

    let x = 0;
    let y = 0;
    const draw = (token: string | PrismJS.Token, colors: CodeTokens) => {
      if (typeof token === 'string') {
        context.fillStyle = colors.punctuation ?? FALLBACK_COLOR;
        const lines = token.split('\n');
        let isFirst = true;
        for (const line of lines) {
          if (!isFirst) {
            x = 0;
            y++;
          }
          isFirst = false;

          const trim = line.length - line.trimStart().length;
          context.globalAlpha = this.getOpacityAtPoint(x + trim, y);
          context.fillText(line, x * letterWidth, (y + 0.5) * lineHeight);
          x += line.length;
        }
      } else if (typeof token.content === 'string') {
        if (!(token.type in colors)) {
          console.warn(`Unstyled token type:`, token.type);
        }
        context.fillStyle = colors[token.type] ?? FALLBACK_COLOR;
        context.globalAlpha = this.getOpacityAtPoint(x, y);
        context.fillText(
          token.content,
          x * letterWidth,
          (y + 0.5) * lineHeight,
        );
        x += token.length;
      } else if (Array.isArray(token.content)) {
        const subTheme = theme[token.type] ?? colors;
        for (const subToken of token.content) {
          draw(subToken, subTheme);
        }
      } else {
        const subTheme = theme[token.type] ?? colors;
        draw(token.content, subTheme);
      }
    };

    for (const token of this.getTokens()) {
      draw(token, theme.default);
    }
  }

  private drawLineNumbers(context: CanvasRenderingContext2D) {
    const theme = this.theme();
    const lines = this.getLines();
    const lineHeight = this.fontSize() * this.lineHeight();

    context.save();
    context.fillStyle = theme.default.comment ?? FALLBACK_COLOR;
    context.globalAlpha = this.getAbsoluteOpacity();
    context.textAlign = 'right';
    for (let i = 0; i < lines.length; i++) {
      context.fillText(i.toString(), -20, (i + 0.5) * lineHeight);
    }
    context.restore();
  }

  private getOpacityAtPoint(x: number, y: number): number {
    return this.isSelected(x, y)
      ? this.getAbsoluteOpacity()
      : this.getAbsoluteOpacity() * this.unselectedOpacity;
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

  public selectWord(line: number, from: number, length?: number): this {
    this.selection([
      [
        [line, from],
        [line, from + (length ?? Infinity)],
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
  public *animate(): ThreadGenerator {
    const hasSelection = this.hasSelection();
    const currentOpacity = this.unselectedOpacity;

    yield* tween(0.5, value => {
      this.outline = easeOutExpo(value, -8, 0);
      this.unselectedOpacity = easeOutExpo(
        value,
        currentOpacity,
        hasSelection ? 0.32 : 1,
      );
    });
    this.apply();
  }

  @threadable()
  public *animateClearSelection() {
    const currentOpacity = this.unselectedOpacity;
    yield* tween(0.5, value => {
      this.outline = easeInExpo(value, 0, -8);
      this.unselectedOpacity = easeInExpo(value, currentOpacity, 1);
    });
    this.clearSelection();
    this.apply();
  }
}
