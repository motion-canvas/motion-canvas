import {
  PossibleVector2,
  SignalValue,
  SimpleSignal,
  Vector2Signal,
  map,
} from '@motion-canvas/core';
import {initial, nodeName, signal, vector2Signal} from '../decorators';
import {Shape, ShapeProps} from './Shape';

export interface GridProps extends ShapeProps {
  /**
   * {@inheritDoc Grid.spacing}
   */
  spacing?: SignalValue<PossibleVector2>;
  /**
   * {@inheritDoc Grid.start}
   */
  start?: SignalValue<number>;
  /**
   * {@inheritDoc Grid.end}
   */
  end?: SignalValue<number>;
}

/**
 * A node for drawing a two-dimensional grid.
 *
 * @preview
 * ```tsx editor
 * import {Grid, makeScene2D} from '@motion-canvas/2d';
 * import {all, createRef} from '@motion-canvas/core';
 *
 * export default makeScene2D(function* (view) {
 *   const grid = createRef<Grid>();
 *
 *   view.add(
 *     <Grid
 *       ref={grid}
 *       width={'100%'}
 *       height={'100%'}
 *       stroke={'#666'}
 *       start={0}
 *       end={1}
 *     />,
 *   );
 *
 *   yield* all(
 *     grid().end(0.5, 1).to(1, 1).wait(1),
 *     grid().start(0.5, 1).to(0, 1).wait(1),
 *   );
 * });
 * ```
 */
@nodeName('Grid')
export class Grid extends Shape {
  /**
   * The spacing between the grid lines.
   */
  @initial(80)
  @vector2Signal('spacing')
  public declare readonly spacing: Vector2Signal<this>;

  /**
   * The percentage that should be clipped from the beginning of each grid line.
   *
   * @remarks
   * The portion of each grid line that comes before the given percentage will
   * be made invisible.
   *
   * This property is useful for animating the grid appearing on-screen.
   */
  @initial(0)
  @signal()
  public declare readonly start: SimpleSignal<number, this>;

  /**
   * The percentage that should be clipped from the end of each grid line.
   *
   * @remarks
   * The portion of each grid line that comes after the given percentage will
   * be made invisible.
   *
   * This property is useful for animating the grid appearing on-screen.
   */
  @initial(1)
  @signal()
  public declare readonly end: SimpleSignal<number, this>;

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
      const [from, to] = this.mapPoints(-size.height, size.height);

      context.beginPath();
      context.moveTo(spacing.x * x, from);
      context.lineTo(spacing.x * x, to);
      context.stroke();
    }

    for (let y = -steps.y; y <= steps.y; y++) {
      const [from, to] = this.mapPoints(-size.width, size.width);

      context.beginPath();
      context.moveTo(from, spacing.y * y);
      context.lineTo(to, spacing.y * y);
      context.stroke();
    }

    context.restore();
  }

  private mapPoints(start: number, end: number): [number, number] {
    let from = map(start, end, this.start());
    let to = map(start, end, this.end());

    if (to < from) {
      [from, to] = [to, from];
    }

    return [from, to];
  }
}
