import {initial, signal} from '../decorators/signal';
import {vector2Signal} from '../decorators/vector2Signal';
import {computed} from '../decorators/computed';
import {initialize} from '../decorators/initializers';
import {
  Color,
  PossibleColor,
  Vector2,
  Vector2Signal,
} from '@motion-canvas/core/lib/types';
import {SimpleSignal} from '@motion-canvas/core/lib/signals';

export type GradientType = 'linear' | 'conic' | 'radial';

export interface GradientStop {
  offset: number;
  color: PossibleColor;
}

export interface GradientProps {
  type?: GradientType;
  fromX?: number;
  fromY?: number;
  from?: Vector2;
  toX?: number;
  toY?: number;
  to?: Vector2;
  angle?: number;
  fromRadius?: number;
  toRadius?: number;
  stops?: GradientStop[];
}

export class Gradient {
  @initial('linear')
  @signal()
  public declare readonly type: SimpleSignal<GradientType, this>;

  @vector2Signal('from')
  public declare readonly from: Vector2Signal<this>;

  @vector2Signal('to')
  public declare readonly to: Vector2Signal<this>;

  @initial(0)
  @signal()
  public declare readonly angle: SimpleSignal<number, this>;
  @initial(0)
  @signal()
  public declare readonly fromRadius: SimpleSignal<number, this>;
  @initial(0)
  @signal()
  public declare readonly toRadius: SimpleSignal<number, this>;
  @initial([])
  @signal()
  public declare readonly stops: SimpleSignal<GradientStop[], this>;

  public constructor(props: GradientProps) {
    initialize(this, {defaults: props});
  }

  @computed()
  public canvasGradient(context: CanvasRenderingContext2D): CanvasGradient {
    let gradient: CanvasGradient;
    switch (this.type()) {
      case 'linear':
        gradient = context.createLinearGradient(
          this.from.x(),
          this.from.y(),
          this.to.x(),
          this.to.y(),
        );
        break;
      case 'conic':
        gradient = context.createConicGradient(
          this.angle(),
          this.from.x(),
          this.from.y(),
        );
        break;
      case 'radial':
        gradient = context.createRadialGradient(
          this.from.x(),
          this.from.y(),
          this.fromRadius(),
          this.to.x(),
          this.to.y(),
          this.toRadius(),
        );
        break;
    }

    for (const {offset, color} of this.stops()) {
      gradient.addColorStop(offset, new Color(color).serialize());
    }

    return gradient;
  }
}
