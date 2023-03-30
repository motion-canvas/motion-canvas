import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';
import {clamp} from '@motion-canvas/core/lib/tweening';
import {BBox, SerializedVector2, Vector2} from '@motion-canvas/core/lib/types';
import {
  CurveDrawingInfo,
  CurvePoint,
  CurveProfile,
  getPointAtDistance,
} from '../curves';
import {computed, initial, signal} from '../decorators';
import {DesiredLength} from '../partials';
import {lineTo, moveTo, resolveCanvasStyle} from '../utils';
import {Node} from './Node';
import {Shape, ShapeProps} from './Shape';

export interface CurveProps extends ShapeProps {
  children?: Node[];
  closed?: SignalValue<boolean>;
  start?: SignalValue<number>;
  startOffset?: SignalValue<number>;
  startArrow?: SignalValue<Node | boolean>;
  end?: SignalValue<number>;
  endOffset?: SignalValue<number>;
  endArrow?: SignalValue<Node | boolean>;
  arrowSize?: SignalValue<number>;
}

export abstract class Curve extends Shape {
  @initial(false)
  @signal()
  public declare readonly closed: SimpleSignal<boolean, this>;

  @initial(0)
  @signal()
  public declare readonly start: SimpleSignal<number, this>;

  @initial(0)
  @signal()
  public declare readonly startOffset: SimpleSignal<number, this>;
  /**
   * Specifies if or what arrow should be drawn at the start of the line.
   *
   * @remarks
   * If `true`, a default arrow will be drawn. This can be used with the {@link arrowSize} signal to change the size of the arrow.
   * If set to a {@link Node}, the node will be used as the arrow. This can be used to edraw a custom arrow. If a custom arrow is used, the {@link arrowSize} signal will be ignored.
   **/
  @initial(false)
  @signal()
  public declare readonly startArrow: SimpleSignal<Node | boolean, this>;

  @initial(1)
  @signal()
  public declare readonly end: SimpleSignal<number, this>;

  @initial(0)
  @signal()
  public declare readonly endOffset: SimpleSignal<number, this>;
  /**
   * Specifies if or what arrow should be drawn at the start of the line.
   *
   * @remarks
   * If `true`, a default arrow will be drawn. This can be used with the {@link arrowSize} signal to change the size of the arrow.
   * If set to a {@link Node}, the node will be used as the arrow. This can be used to edraw a custom arrow. If a custom arrow is used, the {@link arrowSize} signal will be ignored.
   **/
  @initial(false)
  @signal()
  public declare readonly endArrow: SimpleSignal<Node | boolean, this>;

  @initial(24)
  @signal()
  public declare readonly arrowSize: SimpleSignal<number, this>;

  protected override desiredSize(): SerializedVector2<DesiredLength> {
    return this.childrenBBox().size;
  }

  public constructor(props: CurveProps) {
    super(props);
  }

  protected abstract childrenBBox(): BBox;

  public abstract profile(): CurveProfile;

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

      const [startCurvePoint, endCurvePoint] = segment.draw(
        path,
        clampedStart,
        clampedEnd,
        startPoint === null,
      );

      if (startPoint === null) {
        startPoint = startCurvePoint.position;
        startTangent = startCurvePoint.normal.flipped.perpendicular;
      }

      endPoint = endCurvePoint.position;
      endTangent = endCurvePoint.normal.flipped.perpendicular;
      if (length > end) {
        break;
      }
    }

    if (this.end() === 1 && this.closed()) {
      path.closePath();
    }

    return {
      startPoint: startPoint ?? Vector2.zero,
      startTangent: startTangent ?? Vector2.right,
      endPoint: endPoint ?? Vector2.zero,
      endTangent: endTangent ?? Vector2.right,
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

  protected override getComputedLayout(): BBox {
    return this.offsetComputedLayout(super.getComputedLayout());
  }

  protected offsetComputedLayout(box: BBox): BBox {
    box.position = box.position.sub(this.childrenBBox().center);
    return box;
  }

  protected override getPath(): Path2D {
    return this.curveDrawingInfo().path;
  }

  protected override getCacheBBox(): BBox {
    const box = this.childrenBBox();
    const arrowSize = this.arrowSize();
    const lineWidth = this.lineWidth();

    const coefficient = this.lineWidthCoefficient();

    return box.expand(Math.max(0, arrowSize, lineWidth * coefficient));
  }

  protected lineWidthCoefficient(): number {
    return this.lineCap() === 'square' ? 0.5 * 1.4143 : 0.5;
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
    if (this.endArrow() instanceof Node) {
      this.drawArrowNode(
        context,
        this.endArrow() as Node,
        endPoint,
        endTangent.radians,
      );
    } else if (this.endArrow()) {
      this.drawArrow(context, endPoint, endTangent, arrowSize);
    }
    if (this.startArrow() instanceof Node) {
      this.drawArrowNode(
        context,
        this.startArrow() as Node,
        startPoint,
        startTangent.radians,
      );
    } else if (this.startArrow()) {
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
    const origin = center.add(tangent.scale(-arrowSize / 2));

    moveTo(context, origin);
    lineTo(context, origin.add(tangent.add(normal).scale(arrowSize)));
    lineTo(context, origin.add(tangent.sub(normal).scale(arrowSize)));
    lineTo(context, origin);
    context.closePath();
  }

  private drawArrowNode(
    context: CanvasRenderingContext2D,
    arrow: Node,
    arrowPoint: Vector2,
    arrowAngle: number,
  ) {
    context.save();
    context.translate(arrowPoint.x, arrowPoint.y);
    context.rotate(arrowAngle);

    arrow.render(context);

    context.restore();
  }
}
