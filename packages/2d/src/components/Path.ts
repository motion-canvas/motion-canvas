import {
  createSignal,
  SignalValue,
  SimpleSignal,
} from '@motion-canvas/core/lib/signals';
import {BBox, Vector2} from '@motion-canvas/core/lib/types';
import {CurveProfile, LineSegment} from '../curves';
import {getPathProfile} from '../curves/getPathProfile';
import {computed, signal} from '../decorators';
import {PolynomialSegment} from '../curves/PolynomialSegment';
import {useLogger} from '@motion-canvas/core/lib/utils';
import {ArcSegment} from '../curves/ArcSegment';
import {drawLine, lineTo} from '../utils';
import {Curve, CurveProps} from './Curve';
import {threadable} from '@motion-canvas/core/lib/decorators';
import {TimingFunction, tween} from '@motion-canvas/core/lib/tweening';
import {interpolateCurveProfile} from '../curves/interpolateCurveProfile';

export interface PathProps extends CurveProps {
  data?: SignalValue<string>;
  tweenAlignPath?: SignalValue<boolean>;
}

export class Path extends Curve {
  private currentProfile = createSignal<CurveProfile | null>(null);
  @signal()
  public declare readonly data: SimpleSignal<string, this>;
  @signal()
  public declare readonly tweenAlignPath: SimpleSignal<boolean, this>;

  public constructor(props: PathProps) {
    super(props);
    this.canHaveSubpath = true;

    if (!props.data) {
      useLogger().warn({
        message: `Path data not specified for Path. Path need path data.`,
        inspect: this.key,
      });
    }
  }

  @computed()
  public override profile(): CurveProfile {
    const currentProfile = this.currentProfile();
    if (currentProfile) return currentProfile;
    return getPathProfile(this.data());
  }

  protected override childrenBBox() {
    const points = this.profile().segments.flatMap(segment => {
      if (segment instanceof LineSegment) return [segment.from, segment.to];
      else if (segment instanceof PolynomialSegment) return segment.points;
      else if (segment instanceof ArcSegment) return segment.extremPoint;
      return [];
    });
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

  @threadable()
  protected *tweenData(
    newPath: string,
    time: number,
    timingFunction: TimingFunction,
  ) {
    const fromProfile = this.profile();
    const toProfile = getPathProfile(newPath);

    const interpolator = interpolateCurveProfile(fromProfile, toProfile);

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

    const radius = 8;
    context.beginPath();
    lineTo(context, offset.addY(-radius));
    lineTo(context, offset.addY(radius));
    lineTo(context, offset);
    lineTo(context, offset.addX(-radius));
    context.arc(offset.x, offset.y, radius, 0, Math.PI * 2);
    context.stroke();

    context.beginPath();
    drawLine(context, box);
    context.closePath();
    context.stroke();
  }
}
