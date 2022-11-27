import {
  computed,
  initial,
  initialize,
  property,
  Vector2Property,
  vector2Property,
} from '../decorators';
import {Color, PossibleColor, Vector2} from '@motion-canvas/core/lib/types';
import {Signal} from '@motion-canvas/core/lib/utils';

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
  @property()
  public declare readonly type: Signal<GradientType, this>;

  @vector2Property('from')
  public declare readonly from: Vector2Property<this>;

  @vector2Property('to')
  public declare readonly to: Vector2Property<this>;

  @initial(0)
  @property()
  public declare readonly angle: Signal<number, this>;
  @initial(0)
  @property()
  public declare readonly fromRadius: Signal<number, this>;
  @initial(0)
  @property()
  public declare readonly toRadius: Signal<number, this>;
  @initial([])
  @property()
  public declare readonly stops: Signal<GradientStop[], this>;

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
