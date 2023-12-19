import {PossibleVector2, SignalValue, Vector2Signal} from '@motion-canvas/core';
import {QuadBezierSegment} from '../curves';
import {PolynomialSegment} from '../curves/PolynomialSegment';
import {computed, vector2Signal} from '../decorators';
import {lineTo, moveTo, quadraticCurveTo} from '../utils';
import {Bezier, BezierOverlayInfo} from './Bezier';
import {CurveProps} from './Curve';

export interface QuadBezierProps extends CurveProps {
  p0?: SignalValue<PossibleVector2>;
  p0X?: SignalValue<number>;
  p0Y?: SignalValue<number>;

  p1?: SignalValue<PossibleVector2>;
  p1X?: SignalValue<number>;
  p1Y?: SignalValue<number>;

  p2?: SignalValue<PossibleVector2>;
  p2X?: SignalValue<number>;
  p2Y?: SignalValue<number>;
}

/**
 * A node for drawing a quadratic Bézier curve.
 *
 * @preview
 * ```tsx editor
 * import {makeScene2D, QuadBezier} from '@motion-canvas/2d';
 * import {createRef} from '@motion-canvas/core';
 *
 * export default makeScene2D(function* (view) {
 *   const bezier = createRef<QuadBezier>();
 *
 *   view.add(
 *     <QuadBezier
 *       ref={bezier}
 *       lineWidth={4}
 *       stroke={'lightseagreen'}
 *       p0={[-200, 0]}
 *       p1={[0, -200]}
 *       p2={[200, 0]}
 *       end={0}
 *     />
 *   );
 *
 *   yield* bezier().end(1, 1);
 *   yield* bezier().start(1, 1).to(0, 1);
 * });
 * ```
 */
export class QuadBezier extends Bezier {
  /**
   * The start point of the Bézier curve.
   */
  @vector2Signal('p0')
  public declare readonly p0: Vector2Signal<this>;

  /**
   * The control point of the Bézier curve.
   */
  @vector2Signal('p1')
  public declare readonly p1: Vector2Signal<this>;

  /**
   * The end point of the Bézier curve.
   */
  @vector2Signal('p2')
  public declare readonly p2: Vector2Signal<this>;

  public constructor(props: QuadBezierProps) {
    super(props);
  }

  @computed()
  protected segment(): PolynomialSegment {
    return new QuadBezierSegment(this.p0(), this.p1(), this.p2());
  }

  protected overlayInfo(matrix: DOMMatrix): BezierOverlayInfo {
    const [p0, p1, p2] = this.segment().transformPoints(matrix);

    const curvePath = new Path2D();
    moveTo(curvePath, p0);
    quadraticCurveTo(curvePath, p1, p2);

    const handleLinesPath = new Path2D();
    moveTo(handleLinesPath, p0);
    lineTo(handleLinesPath, p1);
    lineTo(handleLinesPath, p2);

    return {
      curve: curvePath,
      startPoint: p0,
      endPoint: p2,
      controlPoints: [p1],
      handleLines: handleLinesPath,
    };
  }
}
