import {PossibleVector2, SignalValue, Vector2Signal} from '@motion-canvas/core';
import {CubicBezierSegment} from '../curves';
import {PolynomialSegment} from '../curves/PolynomialSegment';
import {computed, vector2Signal} from '../decorators';
import {bezierCurveTo, lineTo, moveTo} from '../utils';
import {Bezier, BezierOverlayInfo} from './Bezier';
import {CurveProps} from './Curve';

export interface CubicBezierProps extends CurveProps {
  p0?: SignalValue<PossibleVector2>;
  p0X?: SignalValue<number>;
  p0Y?: SignalValue<number>;

  p1?: SignalValue<PossibleVector2>;
  p1X?: SignalValue<number>;
  p1Y?: SignalValue<number>;

  p2?: SignalValue<PossibleVector2>;
  p2X?: SignalValue<number>;
  p2Y?: SignalValue<number>;

  p3?: SignalValue<PossibleVector2>;
  p3X?: SignalValue<number>;
  p3Y?: SignalValue<number>;
}

/**
 * A node for drawing a cubic Bézier curve.
 *
 * @preview
 * ```tsx editor
 * import {makeScene2D, CubicBezier} from '@motion-canvas/2d';
 * import {createRef} from '@motion-canvas/core';
 *
 * export default makeScene2D(function* (view) {
 *   const bezier = createRef<CubicBezier>();
 *
 *   view.add(
 *     <CubicBezier
 *       ref={bezier}
 *       lineWidth={4}
 *       stroke={'lightseagreen'}
 *       p0={[-200, -100]}
 *       p1={[100, -100]}
 *       p2={[-100, 100]}
 *       p3={[200, 100]}
 *       end={0}
 *     />
 *   );
 *
 *   yield* bezier().end(1, 1);
 *   yield* bezier().start(1, 1).to(0, 1);
 * });
 * ```
 */
export class CubicBezier extends Bezier {
  /**
   * The start point of the Bézier curve.
   */
  @vector2Signal('p0')
  public declare readonly p0: Vector2Signal<this>;

  /**
   * The first control point of the Bézier curve.
   */
  @vector2Signal('p1')
  public declare readonly p1: Vector2Signal<this>;

  /**
   * The second control point of the Bézier curve.
   */
  @vector2Signal('p2')
  public declare readonly p2: Vector2Signal<this>;

  /**
   * The end point of the Bézier curve.
   */
  @vector2Signal('p3')
  public declare readonly p3: Vector2Signal<this>;

  public constructor(props: CubicBezierProps) {
    super(props);
  }

  @computed()
  protected segment(): PolynomialSegment {
    return new CubicBezierSegment(this.p0(), this.p1(), this.p2(), this.p3());
  }

  protected overlayInfo(matrix: DOMMatrix): BezierOverlayInfo {
    const [p0, p1, p2, p3] = this.segment().transformPoints(matrix);

    const curvePath = new Path2D();
    moveTo(curvePath, p0);
    bezierCurveTo(curvePath, p1, p2, p3);

    const handleLinesPath = new Path2D();
    moveTo(handleLinesPath, p0);
    lineTo(handleLinesPath, p1);
    moveTo(handleLinesPath, p2);
    lineTo(handleLinesPath, p3);

    return {
      curve: curvePath,
      startPoint: p0,
      endPoint: p3,
      controlPoints: [p1, p2],
      handleLines: handleLinesPath,
    };
  }
}
