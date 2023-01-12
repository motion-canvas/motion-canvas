import {Shape, ShapeProps} from './Shape';
import {PossibleVector2, Vector2Signal} from '@motion-canvas/core/lib/types';
import {initial, vector2Signal} from '../decorators';
import {SignalValue} from '@motion-canvas/core/lib/signals';

export interface GridProps extends ShapeProps {
  spacing?: SignalValue<PossibleVector2>;
}

export class Grid extends Shape {
  @initial(80)
  @vector2Signal('spacing')
  public declare readonly spacing: Vector2Signal<this>;

  public constructor(props: GridProps) {
    super(props);
  }

  protected override drawShape(context: CanvasRenderingContext2D) {
    context.save();
    this.applyStyle(context);
    this.drawRipple(context);

    const spacing = this.spacing();
    const size = this.computedSize().scale(0.5);
    const steps = size.div(spacing).floored;

    for (let x = -steps.x; x <= steps.x; x++) {
      context.beginPath();
      context.moveTo(spacing.x * x, -size.height);
      context.lineTo(spacing.x * x, size.height);
      context.stroke();
    }

    for (let y = -steps.y; y <= steps.y; y++) {
      context.beginPath();
      context.moveTo(-size.width, spacing.y * y);
      context.lineTo(size.width, spacing.y * y);
      context.stroke();
    }

    context.restore();
  }
}
