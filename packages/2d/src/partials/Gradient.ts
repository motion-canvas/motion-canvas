import {compound, computed, initialize, property} from '../decorators';
import {Vector2} from '@motion-canvas/core/lib/types';
import {Signal} from '@motion-canvas/core/lib/utils';
import {vector2dLerp} from '@motion-canvas/core/lib/tweening';

export type GradientType = 'linear' | 'conic' | 'radial';

export interface GradientStop {
  offset: number;
  color: string;
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
  @property('linear')
  public declare readonly type: Signal<GradientType, this>;

  @property(0)
  public declare readonly fromX: Signal<number, this>;
  @property(0)
  public declare readonly fromY: Signal<number, this>;
  @compound({x: 'fromX', y: 'fromY'})
  @property(undefined, vector2dLerp)
  public declare readonly from: Signal<Vector2, this>;

  @property(0)
  public declare readonly toX: Signal<number, this>;
  @property(0)
  public declare readonly toY: Signal<number, this>;
  @compound({x: 'toX', y: 'toY'})
  @property(undefined, vector2dLerp)
  public declare readonly to: Signal<Vector2, this>;

  @property(0)
  public declare readonly angle: Signal<number, this>;
  @property(0)
  public declare readonly fromRadius: Signal<number, this>;
  @property(0)
  public declare readonly toRadius: Signal<number, this>;
  @property([])
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
      gradient.addColorStop(offset, color);
    }

    return gradient;
  }
}
