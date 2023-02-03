import {computed, initial, parser, signal} from '../decorators';
import {useLogger} from '@motion-canvas/core/lib/utils';
import {Shape, ShapeProps} from './Shape';
import {CodeTree, parse, diff, ready, MorphToken, Token} from 'code-fns';
import {
  clampRemap,
  easeInOutSine,
  map,
  TimingFunction,
  tween,
} from '@motion-canvas/core/lib/tweening';
import {threadable} from '@motion-canvas/core/lib/decorators';
import {Length} from '../partials';
import {SerializedVector2, Vector2} from '@motion-canvas/core/lib/types';
import {
  createComputedAsync,
  createSignal,
  Signal,
  SignalValue,
  SimpleSignal,
} from '@motion-canvas/core/lib/signals';
import {join, ThreadGenerator} from '@motion-canvas/core/lib/threading';
import {waitFor} from '@motion-canvas/core/lib/flow';

type CodePoint = [number, number];
type CodeRange = [CodePoint, CodePoint];

export interface CodeProps extends ShapeProps {
  language?: string;
  children?: CodeTree | string;
  code?: SignalValue<CodeTree | string>;
  selection?: CodeRange[];
}

export interface CodeModification {
  from: string;
  to: string;
}

export class CodeBlock extends Shape {
  private static initialized = createComputedAsync(
    () => ready().then(() => true),
    false,
  );

  @initial('tsx')
  @signal()
  public declare readonly language: SimpleSignal<string, this>;

  @initial('')
  @parser(function (this: CodeBlock, value: CodeTree | string): CodeTree {
    return typeof value === 'string'
      ? {
          language: this.language(),
          spans: [value],
          nodes: [],
        }
      : value;
  })
  @signal()
  public declare readonly code: Signal<CodeTree | string, CodeTree, this>;

  @initial(lines(0, Infinity))
  @signal()
  public declare readonly selection: SimpleSignal<CodeRange[], this>;

  protected *tweenSelection(
    value: CodeRange[],
    duration: number,
    timingFunction: TimingFunction,
  ): ThreadGenerator {
    this.oldSelection = this.selection();
    this.selection(value);
    this.selectionProgress(0);
    yield* this.selectionProgress(1, duration, timingFunction);
    this.selectionProgress(null);
    this.oldSelection = null;
  }

  @initial(0.32)
  @signal()
  public declare readonly selectionOpacity: SimpleSignal<number, this>;

  private codeProgress = createSignal<number | null>(null);
  private selectionProgress = createSignal<number | null>(null);
  private oldSelection: CodeRange[] | null = null;
  private diffed: MorphToken[] | null = null;

  @computed()
  protected parsed() {
    if (!CodeBlock.initialized()) {
      return [];
    }

    return parse(this.code());
  }

  public constructor({children, ...rest}: CodeProps) {
    super({
      fontFamily: 'monospace',
      ...rest,
    });
    if (children) {
      this.code(children);
    }
  }

  @computed()
  protected characterSize() {
    this.requestFontUpdate();
    const context = this.cacheCanvas();
    context.save();
    this.applyStyle(context);
    context.font = this.styles.font;
    const width = context.measureText('X').width;
    context.restore();

    return new Vector2(width, parseFloat(this.styles.lineHeight));
  }

  protected override desiredSize(): SerializedVector2<Length> {
    const custom = super.desiredSize();
    const tokensSize = this.getTokensSize(this.parsed());
    return {
      x: custom.x ?? tokensSize.x,
      y: custom.y ?? tokensSize.y,
    };
  }

  protected getTokensSize(tokens: Token[]) {
    const size = this.characterSize();
    let maxWidth = 0;
    let height = size.height;
    let width = 0;

    for (const token of tokens) {
      for (let i = 0; i < token.code.length; i++) {
        if (token.code[i] === '\n') {
          if (width > maxWidth) {
            maxWidth = width;
          }
          width = 0;
          height += size.height;
        } else {
          width += size.width;
        }
      }
    }

    if (width > maxWidth) {
      maxWidth = width;
    }

    return {x: maxWidth, y: height};
  }

  protected override collectAsyncResources(): void {
    super.collectAsyncResources();
    CodeBlock.initialized();
  }

  public set(strings: string[], ...rest: any[]) {
    this.code({
      language: this.language(),
      spans: strings,
      nodes: rest,
    });
  }

  /**
   * Smoothly edit the code.
   *
   * @remarks
   * This method returns a tag function that should be used together with a
   * template literal to define what to edit. Expressions can be used to either
   * {@link insert}, {@link remove}, or {@link edit} the code.
   *
   * @example
   * ```ts
   * yield* codeBlock().edit()`
   *   const ${edit('a', 'b')} = [${insert('1, 2, 3')}];${remove(`
   *   // this comment will be removed`)}
   * `;
   * ```
   *
   * @param duration - The duration of the transition.
   * @param changeSelection - When set to `true`, the selection will be modified
   *                          to highlight the newly inserted code. Setting it
   *                          to `false` leaves the selection untouched.
   *                          Providing a custom {@link CodeRange} will select
   *                          it instead.
   */
  public edit(duration = 0.6, changeSelection: CodeRange[] | boolean = true) {
    function* generator(
      this: CodeBlock,
      strings: TemplateStringsArray,
      ...rest: CodeModification[]
    ): ThreadGenerator {
      const from = {
        language: this.language(),
        spans: [...strings],
        nodes: rest.map(modification =>
          typeof modification === 'object'
            ? modification?.from ?? modification
            : modification,
        ),
      };
      const to = {
        language: this.language(),
        spans: [...strings],
        nodes: rest.map(modification =>
          typeof modification === 'object'
            ? modification?.to ?? modification
            : modification,
        ),
      };
      this.code(from);

      if (changeSelection) {
        const task = yield this.code(to, duration);
        yield* waitFor(duration * 0.2);
        yield* this.selection([], duration * 0.3);

        const newSelection: CodeRange[] =
          changeSelection === true
            ? diff(from, to)
                .filter(token => token.morph === 'create')
                .map(token => [
                  [token.to![1], token.to![0]],
                  [token.to![1], token.to![0] + token.code.length],
                ])
            : changeSelection;

        yield* this.selection(newSelection, duration * 0.3);
        yield* join(task);
      } else {
        yield* this.code(to, duration);
      }
    }

    return generator.bind(this);
  }

  @threadable()
  public *tweenCode(
    code: CodeTree,
    time: number,
    timingFunction: TimingFunction,
  ) {
    if (typeof code === 'function') throw new Error();
    if (!CodeBlock.initialized()) return;

    const autoWidth = this.customWidth() === null;
    const autoHeight = this.customHeight() === null;
    const fromSize = this.size();
    const toSize = this.getTokensSize(parse(code));

    const beginning = 0.2;
    const ending = 0.8;

    this.codeProgress(0);
    this.diffed = diff(this.code(), code);
    yield* tween(
      time,
      value => {
        const progress = timingFunction(value);
        const remapped = clampRemap(beginning, ending, 0, 1, progress);
        this.codeProgress(progress);
        if (autoWidth) {
          this.customWidth(easeInOutSine(remapped, fromSize.x, toSize.x));
        }
        if (autoHeight) {
          this.customHeight(easeInOutSine(remapped, fromSize.y, toSize.y));
        }
      },
      () => {
        this.codeProgress(null);
        this.diffed = null;
        if (autoWidth) {
          this.customWidth(null);
        }
        if (autoHeight) {
          this.customHeight(null);
        }
        this.code(code);
      },
    );
  }

  protected override draw(context: CanvasRenderingContext2D) {
    if (!CodeBlock.initialized()) return;

    this.requestFontUpdate();
    this.applyStyle(context);
    context.font = this.styles.font;
    context.textBaseline = 'top';
    const lh = parseFloat(this.styles.lineHeight);
    const w = context.measureText('X').width;
    const size = this.computedSize();
    const progress = this.codeProgress();
    const selectionOpacity = this.selectionOpacity();

    const getSelectionAlpha = (x: number, y: number) =>
      map(selectionOpacity, 1, this.selectionStrength(x, y));

    context.translate(size.x / -2, size.y / -2);
    if (progress == null) {
      const parsed = this.parsed();
      let x = 0;
      let y = 0;
      for (const token of parsed) {
        context.save();
        context.fillStyle = token.color ?? '#ff6470';

        if (token.code.includes('()')) {
          const alpha = context.globalAlpha;
          for (let i = 0; i < token.code.length; i++) {
            const char = token.code.charAt(i);
            if (char === '\n') {
              y++;
              x = 0;
              continue;
            }
            context.globalAlpha = alpha * getSelectionAlpha(x, y);
            context.fillText(char, x * w, y * lh);
            x++;
          }
          context.restore();
          continue;
        }

        //*
        const [first, ...rest] = token.code.split('\n');
        context.save();
        context.globalAlpha *= getSelectionAlpha(x, y);
        context.fillText(first, x * w, y * lh);
        context.restore();

        x += first.length;
        for (const text of rest) {
          x = 0;
          y++;
          context.save();
          context.globalAlpha *= getSelectionAlpha(x, y);
          context.fillText(text, x * w, y * lh);
          context.restore();
          x = text.length;
        }
        context.restore();
        //*/
      }
    } else {
      const diffed = this.diffed!;

      const beginning = 0.2;
      const ending = 0.8;
      const overlap = 0.15;
      for (const token of diffed) {
        context.save();
        context.fillStyle = token.color ?? '#ff6470';

        if (token.morph === 'delete') {
          context.globalAlpha *= getSelectionAlpha(
            token.from![0],
            token.from![1],
          );
          context.globalAlpha *= clampRemap(
            0,
            beginning + overlap,
            1,
            0,
            progress,
          );
          context.fillText(token.code, token.from![0] * w, token.from![1] * lh);
        } else if (token.morph === 'create') {
          context.globalAlpha *= getSelectionAlpha(token.to![0], token.to![1]);
          context.globalAlpha *= clampRemap(
            ending - overlap,
            1,
            0,
            1,
            progress,
          );
          context.fillText(token.code, token.to![0] * w, token.to![1] * lh);
        } else if (token.morph === 'retain') {
          const remapped = clampRemap(beginning, ending, 0, 1, progress);
          const alpha = context.globalAlpha;
          context.globalAlpha *=
            remapped > 0.5
              ? getSelectionAlpha(token.to![0], token.to![1])
              : getSelectionAlpha(token.from![0], token.from![1]);

          const x = easeInOutSine(
            remapped,
            token.from![0] * w,
            token.to![0] * w,
          );
          const y = easeInOutSine(
            remapped,
            token.from![1] * lh,
            token.to![1] * lh,
          );

          if (token.code.includes('()')) {
            let offsetX = 0;
            let offsetY = 0;
            for (let i = 0; i < token.code.length; i++) {
              const char = token.code.charAt(i);
              if (char === '\n') {
                offsetY++;
                offsetX = 0;
                continue;
              }

              context.globalAlpha =
                alpha *
                (remapped > 0.5
                  ? getSelectionAlpha(
                      token.to![0] + offsetX,
                      token.to![1] + offsetY,
                    )
                  : getSelectionAlpha(
                      token.from![0] + offsetX,
                      token.from![1] + offsetY,
                    ));

              context.fillText(char, x + offsetX * w, y + offsetY * lh);
              offsetX++;
            }
          } else {
            context.fillText(token.code, x, y);
          }
        } else {
          useLogger().warn({
            message: 'Invalid token',
            object: token,
          });
        }
        context.restore();
      }
    }
  }

  protected selectionStrength(x: number, y: number): number {
    const selection = this.selection();
    const selectionProgress = this.selectionProgress();

    const isSelected = CodeBlock.selectionStrength(selection, x, y);
    if (selectionProgress === null || this.oldSelection === null) {
      return isSelected ? 1 : 0;
    }

    const wasSelected = CodeBlock.selectionStrength(this.oldSelection, x, y);
    if (isSelected === wasSelected) {
      return isSelected;
    }

    return map(wasSelected, isSelected, selectionProgress);
  }

  protected static selectionStrength(
    selection: CodeRange[],
    x: number,
    y: number,
  ): number {
    return selection.length > 0 &&
      !!selection.find(([[startLine, startColumn], [endLine, endColumn]]) => {
        return (
          ((y === startLine && x >= startColumn) || y > startLine) &&
          ((y === endLine && x < endColumn) || y < endLine)
        );
      })
      ? 1
      : 0;
  }
}

/**
 * Create a code modification that inserts a piece of code.
 *
 * @remarks
 * Should be used in conjunction with {@link CodeBlock.edit}.
 *
 * @param content - The code to insert.
 */
export function insert(content: string): CodeModification {
  return {
    from: '',
    to: content,
  };
}

/**
 * Create a code modification that removes a piece of code.
 *
 * @remarks
 * Should be used in conjunction with {@link CodeBlock.edit}.
 *
 * @param content - The code to insert.
 */
export function remove(content: string): CodeModification {
  return {
    from: content,
    to: '',
  };
}

/**
 * Create a code modification that changes one piece of code into another.
 *
 * @remarks
 * Should be used in conjunction with {@link CodeBlock.edit}.
 *
 * @param from - The code to change from.
 * @param to - The code to change to.
 */
export function edit(from: string, to: string): CodeModification {
  return {from, to};
}

/**
 * Create a selection range that highlights the given lines.
 *
 * @param from - The line from which the selection starts.
 * @param to - The line at which the selection ends. If omitted, the selection
 *             will cover only one line.
 */
export function lines(from: number, to?: number): CodeRange[] {
  return [
    [
      [from, 0],
      [to ?? from, Infinity],
    ],
  ];
}

/**
 * Create a selection range that highlights the given word.
 *
 * @param line - The line at which the word appears.
 * @param from - The column at which the word starts.
 * @param length - The length of the word. If omitted, the selection will cover
 *                 the rest of the line.
 */
export function word(line: number, from: number, length?: number): CodeRange[] {
  return [
    [
      [line, from],
      [line, from + (length ?? Infinity)],
    ],
  ];
}

/**
 * Create a custom selection range.
 *
 * @param startLine - The line at which the selection starts.
 * @param startColumn - The column at which the selection starts.
 * @param endLine - The line at which the selection ends.
 * @param endColumn - The column at which the selection ends.
 */
export function range(
  startLine: number,
  startColumn: number,
  endLine: number,
  endColumn: number,
): CodeRange[] {
  return [
    [
      [startLine, startColumn],
      [endLine, endColumn],
    ],
  ];
}
