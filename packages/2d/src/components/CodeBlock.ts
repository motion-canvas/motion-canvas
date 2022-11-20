import {computed, initial, property} from '../decorators';
import {Signal, SignalValue} from '@motion-canvas/core/lib/utils';
import {Shape, ShapeProps} from './Shape';
import {CodeTree, parse, diff, ready, MorphToken} from 'code-fns';
import {
  clampRemap,
  easeInOutSine,
  TimingFunction,
  tween,
} from '@motion-canvas/core/lib/tweening';
import {threadable} from '@motion-canvas/core/lib/decorators';

export interface CodeProps extends ShapeProps {
  children?: CodeTree;
  code?: CodeTree;
}

export class CodeBlock extends Shape {
  @initial('')
  @property()
  public declare readonly code: Signal<CodeTree, this>;

  private progress: number | null = null;
  private diffed: MorphToken[] | null = null;

  @computed()
  protected parsed() {
    return parse(this.code());
  }

  public constructor({children, ...rest}: CodeProps) {
    super(rest);
    if (children) {
      this.code(children);
    }
  }

  protected override collectAsyncResources(resources: Promise<any>[]): void {
    super.collectAsyncResources(resources);
    resources.push(ready());
  }

  @threadable()
  public *tweenCode(
    code: SignalValue<CodeTree>,
    time: number,
    timingFunction: TimingFunction,
  ) {
    if (typeof code === 'function') throw new Error();
    this.progress = 0;
    this.diffed = diff(this.code(), code);
    yield* tween(
      time,
      value => (this.progress = timingFunction(value)),
      () => {
        this.progress = null;
        this.diffed = null;
        this.code(code);
      },
    );
  }

  protected override draw(context: CanvasRenderingContext2D) {
    this.requestFontUpdate();
    this.applyStyle(context);
    context.font = this.styles.font;
    context.textBaseline = 'top';
    const lh = parseInt(this.styles.fontSize) * 1.5;

    const w = context.measureText('X').width;
    if (this.progress == null) {
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
          const opacity = clampRemap(
            0,
            beginning + overlap,
            1,
            0,
            this.progress,
          );
          context.globalAlpha = opacity;
          context.fillText(token.code, token.from![0] * w, token.from![1] * lh);
          context.restore();
        } else if (token.morph === 'create') {
          context.save();
          const opacity = clampRemap(ending - overlap, 1, 0, 1, this.progress);
          context.globalAlpha = opacity;
          context.fillText(token.code, token.to![0] * w, token.to![1] * lh);
          context.restore();
        } else if (token.morph === 'retain') {
          const progress = clampRemap(beginning, ending, 0, 1, this.progress);
          const x = easeInOutSine(
            progress,
            token.from![0] * w,
            token.to![0] * w,
          );
          const y = easeInOutSine(
            progress,
            token.from![1] * lh,
            token.to![1] * lh,
          );
          context.fillText(token.code, x, y);
        } else {
          console.error(token);
        }
      }
    }
  }
}
