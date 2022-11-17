import {computed, initial, initialize, property} from '../decorators';
import {Signal} from '@motion-canvas/core/lib/utils';

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
  @property()
  public declare readonly image: Signal<CanvasImageSource, this>;
  @initial(null)
  @property()
  public declare readonly repetition: Signal<CanvasRepetition, this>;

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
