import {
  BBox,
  createSignal,
  isReactive,
  SignalValue,
  SimpleSignal,
  threadable,
  TimingFunction,
  tween,
  Vector2,
} from '@motion-canvas/core';
import {CurveProfile} from '../curves';
import {createCurveProfileLerp} from '../curves/createCurveProfileLerp';
import {getPathProfile} from '../curves/getPathProfile';
import {computed, signal} from '../decorators';
import {drawLine, drawPivot} from '../utils';
import {Curve, CurveProps} from './Curve';

export interface PathProps extends CurveProps {
  data: SignalValue<string>;
}

export class Path extends Curve {
  private currentProfile = createSignal<CurveProfile | null>(null);
  @signal()
  public declare readonly data: SimpleSignal<string, this>;

  public constructor(props: PathProps) {
    super(props);
    this.canHaveSubpath = true;
  }

  @computed()
  public override profile(): CurveProfile {
    return this.currentProfile() ?? getPathProfile(this.data());
  }

  protected override childrenBBox() {
    const points = this.profile().segments.flatMap(segment => segment.points);
    return BBox.fromPoints(...points);
  }

  protected override lineWidthCoefficient(): number {
    const join = this.lineJoin();

    let coefficient = super.lineWidthCoefficient();

    if (join === 'miter') {
      const {minSin} = this.profile();
      if (minSin > 0) {
        coefficient = Math.max(coefficient, 0.5 / minSin);
      }
    }

    return coefficient;
  }

  protected override processSubpath(
    path: Path2D,
    startPoint: Vector2 | null,
    endPoint: Vector2 | null,
  ): void {
    if (startPoint && endPoint && startPoint.equals(endPoint)) {
      path.closePath();
    }
  }

  @threadable()
  protected *tweenData(
    newPath: SignalValue<string>,
    time: number,
    timingFunction: TimingFunction,
  ) {
    const fromProfile = this.profile();
    const toProfile = getPathProfile(isReactive(newPath) ? newPath() : newPath);

    const interpolator = createCurveProfileLerp(fromProfile, toProfile);

    this.currentProfile(fromProfile);
    yield* tween(
      time,
      value => {
        const progress = timingFunction(value);
        this.currentProfile(interpolator(progress));
      },
      () => {
        this.currentProfile(null);
        this.data(newPath);
      },
    );
  }

  public override drawOverlay(
    context: CanvasRenderingContext2D,
    matrix: DOMMatrix,
  ): void {
    const box = this.childrenBBox().transformCorners(matrix);
    const size = this.computedSize();
    const offset = size.mul(this.offset()).scale(0.5).transformAsPoint(matrix);
    const segments = this.profile().segments;

    context.lineWidth = 1;
    context.strokeStyle = 'white';
    context.fillStyle = 'white';

    context.save();
    context.setTransform(matrix);
    let endPoint: Vector2 | null = null;
    let path = new Path2D();

    for (const segment of segments) {
      if (endPoint && !segment.getPoint(0).position.equals(endPoint)) {
        context.stroke(path);
        path = new Path2D();
        endPoint = null;
      }
      const [, end] = segment.draw(path, 0, 1, endPoint == null);
      endPoint = end.position;
    }
    context.stroke(path);
    context.restore();

    context.beginPath();
    drawPivot(context, offset);
    context.stroke();

    context.beginPath();
    drawLine(context, box);
    context.closePath();
    context.stroke();
  }
}
