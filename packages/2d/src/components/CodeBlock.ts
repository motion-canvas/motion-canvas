import {computed, initial, signal} from '../decorators';
import {useLogger} from '@motion-canvas/core/lib/utils';
import {Shape, ShapeProps} from './Shape';
import {CodeTree, parse, diff, ready, MorphToken, Token} from 'code-fns';
import {
  clampRemap,
  easeInOutSine,
  TimingFunction,
  tween,
} from '@motion-canvas/core/lib/tweening';
import {threadable} from '@motion-canvas/core/lib/decorators';
import {Length} from '../partials';
import {SerializedVector2, Vector2} from '@motion-canvas/core/lib/types';
import {
  createComputedAsync,
  createSignal,
  SignalValue,
  SimpleSignal,
} from '@motion-canvas/core/lib/signals';

export interface CodeProps extends ShapeProps {
  children?: CodeTree;
  code?: CodeTree;
}

export class CodeBlock extends Shape {
  private static initialized = createComputedAsync(
    () => ready().then(() => true),
    false,
  );

  @initial('')
  @signal()
  public declare readonly code: SimpleSignal<CodeTree, this>;

  private progress = createSignal<number | null>(null);
  private diffed: MorphToken[] | null = null;

  @computed()
  protected parsed() {
    if (!CodeBlock.initialized()) {
      return [];
    }

    return parse(this.code());
  }

  public constructor({children, ...rest}: CodeProps) {
    super(rest);
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

  @threadable()
  public *tweenCode(
    code: SignalValue<CodeTree>,
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

    this.progress(0);
    this.diffed = diff(this.code(), code);
    yield* tween(
      time,
      value => {
        const progress = timingFunction(value);
        const remapped = clampRemap(beginning, ending, 0, 1, progress);
        this.progress(progress);
        if (autoWidth) {
          this.customWidth(easeInOutSine(remapped, fromSize.x, toSize.x));
        }
        if (autoHeight) {
          this.customHeight(easeInOutSine(remapped, fromSize.y, toSize.y));
        }
      },
      () => {
        this.progress(null);
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
    const progress = this.progress();

    context.translate(size.x / -2, size.y / -2);
    if (progress == null) {
      const parsed = this.parsed();
      let x = 0;
      let y = 0;
      for (const token of parsed) {
        context.fillStyle = token.color as string;
        const [first, ...rest] = token.code.split('\n');
        context.fillText(first, x, y);
        x += w * first.length;
        for (const text of rest) {
          x = 0;
          y += lh;
          context.fillText(text, x, y);
          x = w * text.length;
        }
      }
    } else {
      const diffed = this.diffed!;

      const beginning = 0.2;
      const ending = 0.8;
      const overlap = 0.15;
      for (const token of diffed) {
        context.fillStyle = token.color as string;
        if (token.morph === 'delete') {
          context.save();
          const opacity = clampRemap(0, beginning + overlap, 1, 0, progress);
          context.globalAlpha = opacity;
          context.fillText(token.code, token.from![0] * w, token.from![1] * lh);
          context.restore();
        } else if (token.morph === 'create') {
          context.save();
          const opacity = clampRemap(ending - overlap, 1, 0, 1, progress);
          context.globalAlpha = opacity;
          context.fillText(token.code, token.to![0] * w, token.to![1] * lh);
          context.restore();
        } else if (token.morph === 'retain') {
          const remapped = clampRemap(beginning, ending, 0, 1, progress);
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
          context.fillText(token.code, x, y);
        } else {
          useLogger().warn({
            message: 'Invalid token',
            object: token,
          });
        }
      }
    }
  }
}
