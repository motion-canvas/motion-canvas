import {
  createSignal,
  ExperimentalError,
  map,
  SerializedVector2,
  Signal,
  SignalValue,
  SimpleSignal,
  ThreadGenerator,
  TimingFunction,
  unwrap,
  Vector2,
} from '@motion-canvas/core';
import {
  CodeCursor,
  CodeHighlighter,
  CodeRange,
  CodeSelection,
  CodeSignal,
  codeSignal,
  CodeSignalContext,
  DefaultHighlightStyle,
  findAllCodeRanges,
  LezerHighlighter,
  lines,
  parseCodeSelection,
  PossibleCodeScope,
  PossibleCodeSelection,
  resolveScope,
} from '../code';
import {computed, initial, nodeName, parser, signal} from '../decorators';
import {DesiredLength} from '../partials';
import {useScene2D} from '../scenes';
import {Shape, ShapeProps} from './Shape';

export interface DrawTokenHook {
  (
    ctx: CanvasRenderingContext2D,
    text: string,
    position: Vector2,
    color: string,
    selection: number,
  ): void;
}

/**
 * Describes custom drawing logic used by the Code node.
 */
export interface DrawHooks {
  /**
   * Custom drawing logic for individual code tokens.
   *
   * @example
   * ```ts
   * token(ctx, text, position, color, selection) {
   *   const blur = map(3, 0, selection);
   *   const alpha = map(0.5, 1, selection);
   *   ctx.globalAlpha *= alpha;
   *   ctx.filter = `blur(${blur}px)`;
   *   ctx.fillStyle = color;
   *   ctx.fillText(text, position.x, position.y);
   * }
   * ```
   */
  token: DrawTokenHook;
}

export interface CodeProps extends ShapeProps {
  /**
   * {@inheritDoc Code.highlighter}
   */
  highlighter?: SignalValue<CodeHighlighter | null>;
  /**
   * {@inheritDoc Code.dialect}
   */
  dialect?: SignalValue<string>;
  /**
   * {@inheritDoc Code.code}
   */
  code?: SignalValue<PossibleCodeScope>;
  /**
   * {@inheritDoc Code.selection}
   */
  selection?: SignalValue<PossibleCodeSelection>;
  /**
   * {@inheritDoc Code.drawHooks}
   */
  drawHooks?: SignalValue<DrawHooks>;
  children?: never;
}

/**
 * A node for displaying and animating code.
 *
 * @experimental
 *
 * @preview
 * ```tsx editor
 * import {parser} from '@lezer/javascript';
 * import {Code, LezerHighlighter, makeScene2D} from '@motion-canvas/2d';
 * import {createRef} from '@motion-canvas/core';
 *
 * export default makeScene2D(function* (view) {
 *   LezerHighlighter.registerParser(parser);
 *   const code = createRef<Code>();
 *
 *   view.add(
 *     <Code
 *       ref={code}
 *       offset={-1}
 *       position={view.size().scale(-0.5).add(60)}
 *       fontFamily={'JetBrains Mono, monospace'}
 *       fontSize={36}
 *       code={`\
 * function hello() {
 *   console.log('Hello');
 * }`}
 *     />,
 *   );
 *
 *   yield* code()
 *     .code(
 *       `\
 * function hello() {
 *   console.warn('Hello World');
 * }`,
 *       1,
 *     )
 *     .wait(0.5)
 *     .back(1)
 *     .wait(0.5);
 * });
 * ```
 */
@nodeName('CodeBlock')
export class Code extends Shape {
  /**
   * Create a standalone code signal.
   *
   * @param initial - The initial code.
   * @param highlighter - Custom highlighter to use.
   * @param dialect - Custom dialect to use.
   */
  public static createSignal(
    initial: PossibleCodeScope,
    highlighter?: SignalValue<CodeHighlighter>,
    dialect?: SignalValue<string>,
  ): CodeSignal<void> {
    return new CodeSignalContext<void>(
      initial,
      undefined,
      highlighter,
      dialect,
    ).toSignal();
  }

  public static readonly defaultHighlighter = new LezerHighlighter(
    DefaultHighlightStyle,
  );

  /**
   * The dialect to use for highlighting the code.
   *
   * @remarks
   * This value will be passed to the {@link code.CodeHighlighter}
   * defined by the {@link highlighter} property. Different highlighters may use
   * it differently.
   *
   * The default {@link code.LezerHighlighter} uses it to select
   * the language parser to use. The parser for the given dialect can be
   * registered as follows:
   * ```tsx
   * // Import the lezer parser:
   * import {parser} from '@lezer/javascript';
   *
   * // Register it in the highlighter:
   * LezerHighlighter.registerParser(parser, 'js');
   *
   * // Use the dialect in a code node:
   * <Code dialect="js" code="const a = 7;" />
   * ```
   * When no dialect is provided, the highlighter will use the default
   * parser:
   * ```tsx
   * // Register the default parser by omitting the dialect:
   * LezerHighlighter.registerParser(parser);
   *
   * // Code nodes with no dialect will now use the default parser:
   * <Code code="const a = 7;" />
   * ```
   */
  @initial('')
  @signal()
  public declare readonly dialect: SimpleSignal<string, this>;

  /**
   * The code highlighter to use for this code node.
   *
   * @remarks
   * Defaults to a shared {@link code.LezerHighlighter}.
   */
  @initial(() => Code.defaultHighlighter)
  @signal()
  public declare readonly highlighter: SimpleSignal<CodeHighlighter, this>;

  /**
   * The code to display.
   */
  @codeSignal()
  public declare readonly code: CodeSignal<this>;

  /**
   * Custom drawing logic for the code.
   *
   * @remarks
   * Check out {@link DrawHooks} for available render hooks.
   *
   * @example
   * Make the unselected code blurry and transparent:
   * ```tsx
   * <Code
   *   drawHooks={{
   *     token(ctx, text, position, color, selection) {
   *       const blur = map(3, 0, selection);
   *       const alpha = map(0.5, 1, selection);
   *       ctx.globalAlpha *= alpha;
   *       ctx.filter = `blur(${blur}px)`;
   *       ctx.fillStyle = color;
   *       ctx.fillText(text, position.x, position.y);
   *     },
   *   }}
   *   // ...
   * />
   * ```
   */
  @initial<DrawHooks>({
    token(ctx, text, position, color, selection) {
      ctx.fillStyle = color;
      ctx.globalAlpha *= map(0.2, 1, selection);
      ctx.fillText(text, position.x, position.y);
    },
  })
  @signal()
  public declare readonly drawHooks: SimpleSignal<DrawHooks, this>;

  /**
   * The currently selected code range.
   *
   * @remarks
   * Either a single {@link code.CodeRange} or an array of them
   * describing which parts of the code should be visually emphasized.
   *
   * You can use {@link code.word} and
   * {@link code.lines} to quickly create ranges.
   *
   * @example
   * The following will select the word "console" in the code.
   * Both lines and columns are 0-based. So it will select a 7-character-long
   * (`7`) word in the second line (`1`) starting at the third character (`2`).
   * ```tsx
   * <Code
   *   selection={word(1, 2, 7)}
   *   code={`\
   * function hello() => {
   *   console.log('Hello');
   * }`}
   *   // ...
   * />
   * ```
   */
  @initial(lines(0, Infinity))
  @parser(parseCodeSelection)
  @signal()
  public declare readonly selection: Signal<
    PossibleCodeSelection,
    CodeSelection,
    this
  >;
  public oldSelection: CodeSelection | null = null;
  public selectionProgress = createSignal<number | null>(null);
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

  /**
   * Get the currently displayed code as a string.
   */
  @computed()
  public parsed(): string {
    return resolveScope(this.code(), scope => unwrap(scope.progress) > 0.5);
  }

  @computed()
  public highlighterCache() {
    const highlighter = this.highlighter();
    if (!highlighter || !highlighter.initialize()) return null;
    const code = this.code();
    const before = resolveScope(code, false);
    const after = resolveScope(code, true);
    const dialect = this.dialect();

    return {
      before: highlighter.prepare(before, dialect),
      after: highlighter.prepare(after, dialect),
    };
  }

  private cursorCache: CodeCursor | undefined;
  private get cursor() {
    this.cursorCache ??= new CodeCursor(this);
    return this.cursorCache;
  }

  public constructor(props: CodeProps) {
    super({
      fontFamily: 'monospace',
      ...props,
    });
    if (!useScene2D().experimentalFeatures) {
      throw new ExperimentalError('The Code node is an experimental feature');
    }
  }

  /**
   * Create a child code signal.
   *
   * @param initial - The initial code.
   */
  public createSignal(initial: PossibleCodeScope): CodeSignal<this> {
    return new CodeSignalContext<this>(
      initial,
      this,
      this.highlighter,
      this.dialect,
    ).toSignal();
  }

  /**
   * Find all code ranges that match the given pattern.
   *
   * @param pattern - Either a string or a regular expression to match.
   */
  public findAllRanges(pattern: string | RegExp): CodeRange[] {
    return findAllCodeRanges(this.parsed(), pattern);
  }

  /**
   * Find the first code range that matches the given pattern.
   *
   * @param pattern - Either a string or a regular expression to match.
   */
  public findFirstRange(pattern: string | RegExp): CodeRange {
    return findAllCodeRanges(this.parsed(), pattern, 1)[0] ?? [[0, 0], [0, 0]];
  }

  /**
   * Find the last code range that matches the given pattern.
   *
   * @param pattern - Either a string or a regular expression to match.
   */
  public findLastRange(pattern: string | RegExp): CodeRange {
    return findAllCodeRanges(this.parsed(), pattern).at(-1) ?? [[0, 0], [0, 0]];
  }

  protected override desiredSize(): SerializedVector2<DesiredLength> {
    this.requestFontUpdate();
    const context = this.cacheCanvas();
    const code = this.code();

    context.save();
    this.applyStyle(context);
    context.font = this.styles.font;
    this.cursor.setupMeasure(context);
    this.cursor.measureSize(code);
    const size = this.cursor.getSize();
    context.restore();

    return size;
  }

  protected override draw(context: CanvasRenderingContext2D): void {
    this.requestFontUpdate();
    this.applyStyle(context);
    const code = this.code();
    const size = this.computedSize();

    context.translate(-size.width / 2, -size.height / 2);
    context.font = this.styles.font;
    context.textBaseline = 'top';

    this.cursor.setupDraw(context);
    this.cursor.drawScope(code);
  }

  protected override collectAsyncResources(): void {
    super.collectAsyncResources();
    this.highlighter()?.initialize();
  }
}
