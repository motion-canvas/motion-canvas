import {Shape, ShapeProps} from './Shape';
import {Node} from './Node';
import {computed, initial, property} from '../decorators';
import {arc, lineTo, moveTo, resolveCanvasStyle} from '../utils';
import {Signal, SignalValue} from '@motion-canvas/core/lib/utils';
import {Rect, SerializedVector2, Vector2} from '@motion-canvas/core/lib/types';
import {clamp} from '@motion-canvas/core/lib/tweening';
import {Length} from '../partials';
import {Layout} from './Layout';
import {
  CurveDrawingInfo,
  CurveProfile,
  getPolylineProfile,
  getPointAtDistance,
  CurvePoint,
} from '../curves';

export interface LineProps extends ShapeProps {
  children: Node[];
  closed?: SignalValue<boolean>;
  radius?: SignalValue<number>;
  start?: SignalValue<number>;
  startOffset?: SignalValue<number>;
  startArrow?: SignalValue<boolean>;
  end?: SignalValue<number>;
  endOffset?: SignalValue<number>;
  endArrow?: SignalValue<boolean>;
  arrowSize?: SignalValue<number>;
}

export class Line extends Shape {
  @initial(0)
  @property()
  public declare readonly radius: Signal<number, this>;

  @initial(false)
  @property()
  public declare readonly closed: Signal<boolean, this>;

  @initial(0)
  @property()
  public declare readonly start: Signal<number, this>;

  @initial(0)
  @property()
  public declare readonly startOffset: Signal<number, this>;

  @initial(false)
  @property()
  public declare readonly startArrow: Signal<boolean, this>;

  @initial(1)
  @property()
  public declare readonly end: Signal<number, this>;

  @initial(1)
  @property()
  public declare readonly endOffset: Signal<number, this>;

  @initial(false)
  @property()
  public declare readonly endArrow: Signal<boolean, this>;

  @initial(24)
  @property()
  public declare readonly arrowSize: Signal<number, this>;

  protected override desiredSize(): SerializedVector2<Length> {
    return this.childrenRect().size;
  }

  public constructor(props: LineProps) {
    super(props);
  }

  @computed()
  protected childrenRect() {
    return Rect.fromPoints(
      ...this.children()
        .filter(child => !(child instanceof Layout) || child.isLayoutRoot())
        .map(child => child.position()),
    );
  }

  @computed()
  public profile(): CurveProfile {
    const points = this.children().map(child => child.position());
    return getPolylineProfile(points, this.radius(), this.closed());
  }

  public percentageToDistance(value: number): number {
    const {arcLength} = this.profile();
    const startOffset = this.startOffset();
    const endOffset = this.endOffset();
    const realLength = arcLength - startOffset - endOffset;
    return startOffset + realLength * value;
  }

  @computed()
  protected curveDrawingInfo(): CurveDrawingInfo {
    const path = new Path2D();
    const profile = this.profile();

    let start = this.percentageToDistance(this.start());
    let end = this.percentageToDistance(this.end());
    if (start > end) {
      [start, end] = [end, start];
    }

    const distance = end - start;
    const arrowSize = Math.min(distance / 2, this.arrowSize());

    if (this.startArrow()) {
      start += arrowSize / 2;
    }

    if (this.endArrow()) {
      end -= arrowSize / 2;
    }

    let length = 0;
    let startPoint = null;
    let startTangent = null;
    let endPoint = null;
    let endTangent = null;
    for (const segment of profile.segments) {
      const previousLength = length;
      length += segment.arcLength;
      if (length < start) {
        continue;
      }

      const relativeStart = (start - previousLength) / segment.arcLength;
      const relativeEnd = (end - previousLength) / segment.arcLength;

      const clampedStart = clamp(0, 1, relativeStart);
      const clampedEnd = clamp(0, 1, relativeEnd);

      const [
        currentStartPoint,
        currentStartTangent,
        currentEndPoint,
        currentEndTangent,
      ] = segment.draw(path, clampedStart, clampedEnd, startPoint === null);

      if (startPoint === null) {
        startPoint = currentStartPoint;
        startTangent = currentStartTangent;
      }

      endPoint = currentEndPoint;
      endTangent = currentEndTangent;
      if (length > end) {
        break;
      }
    }

    return {
      startPoint: startPoint ?? Vector2.zero,
      startTangent: startTangent ?? Vector2.up,
      endPoint: endPoint ?? Vector2.zero,
      endTangent: endTangent ?? Vector2.up,
      arrowSize,
      path,
      startOffset: start,
    };
  }

  protected getPointAtDistance(value: number): CurvePoint {
    return getPointAtDistance(this.profile(), value + this.startOffset());
  }

  public getPointAtPercentage(value: number): CurvePoint {
    return getPointAtDistance(this.profile(), this.percentageToDistance(value));
  }

  protected override applyStyle(context: CanvasRenderingContext2D) {
    super.applyStyle(context);
    const {arcLength} = this.profile();
    context.lineDashOffset -= arcLength / 2;
  }

  protected override getCustomOffset(): Vector2 {
    if (this.layoutEnabled()) {
      return this.childrenRect().center.flipped;
    } else {
      return Vector2.zero;
    }
  }

  protected override getPath(): Path2D {
    return this.curveDrawingInfo().path;
  }

  protected override getCacheRect(): Rect {
    const arrowSize = this.arrowSize();
    const lineWidth = this.lineWidth();
    return super.getCacheRect().expand(Math.max(0, arrowSize - lineWidth / 2));
  }

  protected override drawShape(context: CanvasRenderingContext2D) {
    super.drawShape(context);
    const {startPoint, startTangent, endPoint, endTangent, arrowSize} =
      this.curveDrawingInfo();
    if (arrowSize < 0.001) {
      return;
    }

    context.save();
    context.beginPath();
    if (this.endArrow()) {
      this.drawArrow(context, endPoint, endTangent, arrowSize);
    }
    if (this.startArrow()) {
      this.drawArrow(context, startPoint, startTangent, arrowSize);
    }
    context.fillStyle = resolveCanvasStyle(this.stroke(), context);
    context.closePath();
    context.fill();
    context.restore();
  }

  private drawArrow(
    context: CanvasRenderingContext2D | Path2D,
    center: Vector2,
    tangent: Vector2,
    arrowSize: number,
  ) {
    const normal = tangent.perpendicular;
    const origin = center.add(normal.scale(-arrowSize / 2));

    moveTo(context, origin);
    lineTo(context, origin.add(normal.add(tangent).scale(arrowSize)));
    lineTo(context, origin.add(normal.sub(tangent).scale(arrowSize)));
    lineTo(context, origin);
    context.closePath();
  }

  public override drawOverlay(
    context: CanvasRenderingContext2D,
    matrix: DOMMatrix,
  ) {
    super.drawOverlay(context, matrix);

    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.lineWidth = 1;

    const path = new Path2D();
    const points = this.children().map(child =>
      child.position().transformAsPoint(matrix),
    );
    moveTo(path, points[0]);
    for (const point of points) {
      lineTo(path, point);
      context.beginPath();
      arc(context, point, 4);
      context.closePath();
      context.fill();
      context.stroke();
    }

    context.strokeStyle = 'white';
    context.stroke(path);
  }
}
