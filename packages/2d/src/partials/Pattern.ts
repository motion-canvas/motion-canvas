import {initial, signal} from '../decorators/signal';
import {computed} from '../decorators/computed';
import {initialize} from '../decorators/initializers';
import {SimpleSignal} from '@motion-canvas/core/lib/signals';

export type CanvasRepetition =
  | null
  | 'repeat'
  | 'repeat-x'
  | 'repeat-y'
  | 'no-repeat';

// TODO Support custom transformation matrices
export interface PatternProps {
  image: CanvasImageSource;
  repetition?: CanvasRepetition;
}

export class Pattern {
  @signal()
  public declare readonly image: SimpleSignal<CanvasImageSource, this>;
  @initial(null)
  @signal()
  public declare readonly repetition: SimpleSignal<CanvasRepetition, this>;

  public constructor(props: PatternProps) {
    initialize(this, {defaults: props});
  }

  @computed()
  public canvasPattern(
    context: CanvasRenderingContext2D,
  ): CanvasPattern | null {
    return context.createPattern(this.image(), this.repetition());
  }
}
