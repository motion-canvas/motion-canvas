import {
  isReactive,
  SignalValue,
  SimpleSignal,
} from '@motion-canvas/core/lib/signals';
import {BBox, PossibleVector2, Vector2} from '@motion-canvas/core/lib/types';
import {useLogger} from '@motion-canvas/core/lib/utils';
import {CurveProfile, getPolylineProfile} from '../curves';
import {computed, initial, signal} from '../decorators';
import {arc, drawLine, drawPivot, lineTo, moveTo} from '../utils';
import {Curve, CurveProps} from './Curve';
import {Layout} from './Layout';
import lineWithoutPoints from './__logs__/line-without-points.md';

export interface LineProps extends CurveProps {
  radius?: SignalValue<number>;
  points?: SignalValue<SignalValue<PossibleVector2>[]>;
}

export class Line extends Curve {
  @initial(0)
  @signal()
  public declare readonly radius: SimpleSignal<number, this>;

  @initial(null)
  @signal()
  public declare readonly points: SimpleSignal<
    SignalValue<PossibleVector2>[] | null,
    this
  >;

  public constructor(props: LineProps) {
    super(props);

    if (props.children === undefined && props.points === undefined) {
      useLogger().warn({
        message: 'No points specified for the line',
        remarks: lineWithoutPoints,
        inspect: this.key,
      });
    }
  }

  @computed()
  protected childrenBBox() {
    const custom = this.points();
    const points = custom
      ? custom.map(
          signal => new Vector2(isReactive(signal) ? signal() : signal),
        )
      : this.children()
          .filter(child => !(child instanceof Layout) || child.isLayoutRoot())
          .map(child => child.position());

    return BBox.fromPoints(...points);
  }

  @computed()
  public parsedPoints(): Vector2[] {
    const custom = this.points();
    return custom
      ? custom.map(
          signal => new Vector2(isReactive(signal) ? signal() : signal),
        )
      : this.children().map(child => child.position());
  }

  @computed()
  public profile(): CurveProfile {
    return getPolylineProfile(
      this.parsedPoints(),
      this.radius(),
      this.closed(),
    );
  }

  protected override lineWidthCoefficient(): number {
    const radius = this.radius();
    const join = this.lineJoin();

    let coefficient = super.lineWidthCoefficient();

    if (radius === 0 && join === 'miter') {
      const {minSin} = this.profile();
      if (minSin > 0) {
        coefficient = Math.max(coefficient, 0.5 / minSin);
      }
    }

    return coefficient;
  }

  public override drawOverlay(
    context: CanvasRenderingContext2D,
    matrix: DOMMatrix,
  ) {
    const box = this.childrenBBox().transformCorners(matrix);
    const size = this.computedSize();
    const offset = size.mul(this.offset()).scale(0.5).transformAsPoint(matrix);

    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.lineWidth = 1;

    const path = new Path2D();
    const points = this.parsedPoints().map(point =>
      point.transformAsPoint(matrix),
    );
    if (points.length > 0) {
      moveTo(path, points[0]);
      for (const point of points) {
        lineTo(path, point);
        context.beginPath();
        arc(context, point, 4);
        context.closePath();
        context.fill();
        context.stroke();
      }
    }

    context.strokeStyle = 'white';
    context.stroke(path);

    context.beginPath();
    drawPivot(context, offset);
    context.stroke();

    context.beginPath();
    drawLine(context, box);
    context.closePath();
    context.stroke();
  }
}
