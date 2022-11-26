import {
  compound,
  computed,
  initial,
  initialize,
  property,
  wrapper,
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

  @initial(0)
  @property()
  public declare readonly fromX: Signal<number, this>;
  @initial(0)
  @property()
  public declare readonly fromY: Signal<number, this>;
  @compound({x: 'fromX', y: 'fromY'})
  @wrapper(Vector2)
  @property()
  public declare readonly from: Signal<Vector2, this>;

  @initial(0)
  @property()
  public declare readonly toX: Signal<number, this>;
  @initial(0)
  @property()
  public declare readonly toY: Signal<number, this>;
  @compound({x: 'toX', y: 'toY'})
  @wrapper(Vector2)
  @property()
  public declare readonly to: Signal<Vector2, this>;

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
          this.fromX(),
          this.fromY(),
          this.toX(),
          this.toY(),
        );
        break;
      case 'conic':
        gradient = context.createConicGradient(
          this.angle(),
          this.fromX(),
          this.fromY(),
        );
        break;
      case 'radial':
        gradient = context.createRadialGradient(
          this.fromX(),
          this.fromY(),
          this.fromRadius(),
          this.toX(),
          this.toY(),
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
