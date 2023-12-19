import {
  Color,
  PossibleColor,
  PossibleVector2,
  SignalValue,
  SimpleSignal,
  Vector2Signal,
  unwrap,
} from '@motion-canvas/core';
import {computed} from '../decorators/computed';
import {initial, initializeSignals, signal} from '../decorators/signal';
import {vector2Signal} from '../decorators/vector2Signal';

export type GradientType = 'linear' | 'conic' | 'radial';

export interface GradientStop {
  offset: SignalValue<number>;
  color: SignalValue<PossibleColor>;
}

export interface GradientProps {
  type?: SignalValue<GradientType>;
  fromX?: SignalValue<number>;
  fromY?: SignalValue<number>;
  from?: SignalValue<PossibleVector2>;
  toX?: SignalValue<number>;
  toY?: SignalValue<number>;
  to?: SignalValue<PossibleVector2>;
  angle?: SignalValue<number>;
  fromRadius?: SignalValue<number>;
  toRadius?: SignalValue<number>;
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
    initializeSignals(this, props);
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
      gradient.addColorStop(
        unwrap(offset),
        new Color(unwrap(color)).serialize(),
      );
    }

    return gradient;
  }
}
