import {
  BBox,
  PossibleVector2,
  SignalValue,
  Vector2Signal,
} from '@motion-canvas/core';
import {CurveProfile, LineSegment} from '../curves';
import {nodeName, vector2Signal} from '../decorators';
import {arc, drawLine, drawPivot} from '../utils';
import {Curve, CurveProps} from './Curve';

export interface RayProps extends CurveProps {
  /**
   * {@inheritDoc Ray.from}
   */
  from?: SignalValue<PossibleVector2>;
  fromX?: SignalValue<number>;
  fromY?: SignalValue<number>;

  /**
   * {@inheritDoc Ray.to}
   */
  to?: SignalValue<PossibleVector2>;
  toX?: SignalValue<number>;
  toY?: SignalValue<number>;
}

/**
 * A node for drawing an individual line segment.
 *
 * @preview
 * ```tsx editor
 * import {makeScene2D} from '@motion-canvas/2d';
 * import {Ray} from '@motion-canvas/2d';
 * import {createRef} from '@motion-canvas/core';
 *
 * export default makeScene2D(function* (view) {
 *   const ray = createRef<Ray>();
 *
 *   view.add(
 *     <Ray
 *       ref={ray}
 *       lineWidth={8}
 *       endArrow
 *       stroke={'lightseagreen'}
 *       fromX={-200}
 *       toX={200}
 *     />,
 *   );
 *
 *   yield* ray().start(1, 1);
 *   yield* ray().start(0).end(0).start(1, 1);
 * });
 * ```
 */
@nodeName('Ray')
export class Ray extends Curve {
  /**
   * The starting point of the ray.
   */
  @vector2Signal('from')
  public declare readonly from: Vector2Signal<this>;

  /**
   * The ending point of the ray.
   */
  @vector2Signal('to')
  public declare readonly to: Vector2Signal<this>;

  public constructor(props: RayProps) {
    super(props);
  }

  protected override childrenBBox() {
    return BBox.fromPoints(this.from(), this.to());
  }

  public override profile(): CurveProfile {
    const segment = new LineSegment(this.from(), this.to());

    return {
      arcLength: segment.arcLength,
      minSin: 1,
      segments: [segment],
    };
  }

  public override drawOverlay(
    context: CanvasRenderingContext2D,
    matrix: DOMMatrix,
  ) {
    const box = this.childrenBBox().transformCorners(matrix);
    const size = this.computedSize();
    const offset = size.mul(this.offset()).scale(0.5).transformAsPoint(matrix);
    const from = this.from().transformAsPoint(matrix);
    const to = this.to().transformAsPoint(matrix);

    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.lineWidth = 1;

    context.beginPath();
    arc(context, from, 4);
    context.fill();
    context.stroke();

    context.beginPath();
    arc(context, to, 4);
    context.fill();
    context.stroke();

    context.strokeStyle = 'white';
    context.beginPath();
    drawLine(context, [from, to]);
    context.stroke();

    context.beginPath();
    drawPivot(context, offset);
    context.stroke();

    context.beginPath();
    drawLine(context, box);
    context.closePath();
    context.stroke();
  }
}
