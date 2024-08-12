import {
  BBox,
  createSignal,
  experimentalLog,
  map,
  SerializedVector2,
  Signal,
  SignalValue,
  SimpleSignal,
  ThreadGenerator,
  TimingFunction,
  unwrap,
  useLogger,
  useScene,
  Vector2,
} from '@motion-canvas/core';
import {
  CodeCursor,
  CodeFragmentDrawingInfo,
  CodeHighlighter,
  CodePoint,
  CodeRange,
  CodeSelection,
  CodeSignal,
  codeSignal,
  CodeSignalContext,
  findAllCodeRanges,
  isPointInCodeSelection,
  lines,
  parseCodeSelection,
  PossibleCodeScope,
  PossibleCodeSelection,
  resolveScope,
} from '../code';
import {computed, initial, nodeName, parser, signal} from '../decorators';
import {DesiredLength} from '../partials';
import {Shape, ShapeProps} from './Shape';

/**
 * @experimental
 */
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
 *
 * @experimental
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
}

/**
 * A node for displaying and animating code.
 *
 * @preview
 * ```tsx editor
 * import {Code, makeScene2D} from '@motion-canvas/2d';
 * import {createRef} from '@motion-canvas/core';
 *
 * export default makeScene2D(function* (view) {
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
   */
  public static createSignal(
    initial: SignalValue<PossibleCodeScope>,
    highlighter?: SignalValue<CodeHighlighter>,
  ): CodeSignal<void> {
    return new CodeSignalContext<void>(
      initial,
      undefined,
      highlighter,
    ).toSignal();
  }

  public static defaultHighlighter: CodeHighlighter | null = null;

  /**
   * The code highlighter to use for this code node.
   *
   * @remarks
   * Defaults to a shared {@link code.LezerHighlighter}.
   */
  @initial(() => Code.defaultHighlighter)
  @signal()
  public declare readonly highlighter: SimpleSignal<
    CodeHighlighter | null,
    this
  >;

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
   * @experimental
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

  protected setDrawHooks(value: DrawHooks) {
    if (
      !useScene().experimentalFeatures &&
      value !== this.drawHooks.context.getInitial()
    ) {
      useLogger().log({
        ...experimentalLog(`Code uses experimental draw hooks.`),
        inspect: this.key,
      });
    } else {
      this.drawHooks.context.setter(value);
    }
  }

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

    return {
      before: highlighter.prepare(before),
      after: highlighter.prepare(after),
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
      highlighter: Code.defaultHighlighter,
      ...props,
    });
  }

  /**
   * Create a child code signal.
   *
   * @param initial - The initial code.
   */
  public createSignal(
    initial: SignalValue<PossibleCodeScope>,
  ): CodeSignal<this> {
    return new CodeSignalContext<this>(
      initial,
      this,
      this.highlighter,
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
    return (
      findAllCodeRanges(this.parsed(), pattern, 1)[0] ?? [
        [0, 0],
        [0, 0],
      ]
    );
  }

  /**
   * Find the last code range that matches the given pattern.
   *
   * @param pattern - Either a string or a regular expression to match.
   */
  public findLastRange(pattern: string | RegExp): CodeRange {
    return (
      findAllCodeRanges(this.parsed(), pattern).at(-1) ?? [
        [0, 0],
        [0, 0],
      ]
    );
  }

  /**
   * Return the bounding box of the given point (character) in the code.
   *
   * @remarks
   * The returned bound box is in local space of the `Code` node.
   *
   * @param point - The point to get the bounding box for.
   */
  public getPointBBox(point: CodePoint): BBox {
    const [line, column] = point;
    const drawingInfo = this.drawingInfo();
    let match: CodeFragmentDrawingInfo | undefined;
    for (const info of drawingInfo.fragments) {
      if (info.cursor.y < line) {
        match = info;
        continue;
      }

      if (info.cursor.y === line && info.cursor.x < column) {
        match = info;
        continue;
      }

      break;
    }

    if (!match) return new BBox();

    const size = this.computedSize();
    return new BBox(
      match.position
        .sub(size.scale(0.5))
        .addX(match.characterSize.x * (column - match.cursor.x)),
      match.characterSize,
    );
  }

  /**
   * Return bounding boxes of all characters in the selection.
   *
   * @remarks
   * The returned bounding boxes are in local space of the `Code` node.
   * Each line of code has a separate bounding box.
   *
   * @param selection - The selection to get the bounding boxes for.
   */
  public getSelectionBBox(selection: PossibleCodeSelection): BBox[] {
    const size = this.computedSize();
    const range = parseCodeSelection(selection);
    const drawingInfo = this.drawingInfo();
    const bboxes: BBox[] = [];

    let current: BBox | null = null;
    let line = 0;
    let column = 0;
    for (const info of drawingInfo.fragments) {
      if (info.cursor.y !== line) {
        line = info.cursor.y;
        if (current) {
          bboxes.push(current);
          current = null;
        }
      }

      column = info.cursor.x;
      for (let i = 0; i < info.text.length; i++) {
        if (isPointInCodeSelection([line, column], range)) {
          const bbox = new BBox(
            info.position
              .sub(size.scale(0.5))
              .addX(info.characterSize.x * (column - info.cursor.x)),
            info.characterSize,
          );
          if (!current) {
            current = bbox;
          } else {
            current = current.union(bbox);
          }
        } else if (current) {
          bboxes.push(current);
          current = null;
        }

        column++;
      }
    }

    if (current) {
      bboxes.push(current);
    }

    return bboxes;
  }

  @computed()
  protected drawingInfo() {
    this.requestFontUpdate();
    const context = this.cacheCanvas();
    const code = this.code();

    context.save();
    this.applyStyle(context);
    this.applyText(context);
    this.cursor.setupDraw(context);
    this.cursor.drawScope(code);
    const info = this.cursor.getDrawingInfo();
    context.restore();

    return info;
  }

  protected override desiredSize(): SerializedVector2<DesiredLength> {
    this.requestFontUpdate();
    const context = this.cacheCanvas();
    const code = this.code();

    context.save();
    this.applyStyle(context);
    this.applyText(context);
    this.cursor.setupMeasure(context);
    this.cursor.measureSize(code);
    const size = this.cursor.getSize();
    context.restore();

    return size;
  }

  protected override draw(context: CanvasRenderingContext2D): void {
    this.requestFontUpdate();
    this.applyStyle(context);
    this.applyText(context);
    const size = this.computedSize();
    const drawingInfo = this.drawingInfo();

    context.save();
    context.translate(
      -size.width / 2,
      -size.height / 2 + drawingInfo.verticalOffset,
    );

    const drawHooks = this.drawHooks();
    for (const info of drawingInfo.fragments) {
      context.save();
      context.globalAlpha *= info.alpha;
      drawHooks.token(context, info.text, info.position, info.fill, info.time);
      context.restore();
    }

    context.restore();

    this.drawChildren(context);
  }

  protected override applyText(context: CanvasRenderingContext2D) {
    super.applyText(context);
    context.font = this.styles.font;
    context.textBaseline = 'top';
    if ('letterSpacing' in context) {
      context.letterSpacing = this.styles.letterSpacing;
    }
  }

  protected override collectAsyncResources(): void {
    super.collectAsyncResources();
    this.highlighter()?.initialize();
  }
}
