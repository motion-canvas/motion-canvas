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
import {Shape, ShapeProps} from './Shape';

export interface CurveProps extends ShapeProps {
  /**
   * {@inheritDoc Curve.closed}
   */
  closed?: SignalValue<boolean>;
  /**
   * {@inheritDoc Curve.start}
   */
  start?: SignalValue<number>;
  /**
   * {@inheritDoc Curve.startOffset}
   */
  startOffset?: SignalValue<number>;
  /**
   * {@inheritDoc Curve.startArrow}
   */
  startArrow?: SignalValue<Node | boolean>;
  /**
   * {@inheritDoc Curve.end}
   */
  end?: SignalValue<number>;
  /**
   * {@inheritDoc Curve.endOffset}
   */
  endOffset?: SignalValue<number>;
  /**
   * {@inheritDoc Curve.endArrow}
   */
  endArrow?: SignalValue<Node | boolean>;
  /**
   * {@inheritDoc Curve.arrowSize}
   */
  arrowSize?: SignalValue<number>;
}

export abstract class Curve extends Shape {
  /**
   * Whether the curve should be closed.
   *
   * @remarks
   * Closed curves have their start and end points connected.
   */
  @initial(false)
  @signal()
  public declare readonly closed: SimpleSignal<boolean, this>;

  /**
   * A percentage from the start before which the curve should be clipped.
   *
   * @remarks
   * The portion of the curve that comes before the given percentage will be
   * made invisible.
   *
   * This property is usefully for animating the curve appearing on the screen.
   * The value of `0` means the very start of the curve (accounting for the
   * {@link startOffset}) while `1` means the very end (accounting for the
   * {@link endOffset}).
   */
  @initial(0)
  @signal()
  public declare readonly start: SimpleSignal<number, this>;

  /**
   * The offset in pixels from the start of the curve.
   *
   * @remarks
   * This property lets you specify where along the defined curve the actual
   * visible portion starts. For example, setting it to `20` will make the first
   * 20 pixels of the curve invisible.
   *
   * This property is useful for trimming the curve using a fixed distance.
   * If you want to animate the curve appearing on the screen, use {@link start}
   * instead.
   */
  @initial(0)
  @signal()
  public declare readonly startOffset: SimpleSignal<number, this>;

  /**
   * Whether to display an arrow at the start of the visible curve.
   *
   * @remarks
   * If `true`, a default arrow will be drawn. The size of the arrow can be
   * controlled with {@link arrowSize}.
   * If set to a {@link Node}, the node will be used as the arrow. If a custom
   * arrow is used, the {@link arrowSize} signal will be ignored.
   **/
  @initial(false)
  @signal()
  public declare readonly startArrow: SimpleSignal<Node | boolean, this>;

  /**
   * A percentage from the start after which the curve should be clipped.
   *
   * @remarks
   * The portion of the curve that comes after the given percentage will be
   * made invisible.
   *
   * This property is usefully for animating the curve appearing on the screen.
   * The value of `0` means the very start of the curve (accounting for the
   * {@link startOffset}) while `1` means the very end (accounting for the
   * {@link endOffset}).
   */
  @initial(1)
  @signal()
  public declare readonly end: SimpleSignal<number, this>;

  /**
   * The offset in pixels from the end of the curve.
   *
   * @remarks
   * This property lets you specify where along the defined curve the actual
   * visible portion ends. For example, setting it to `20` will make the last
   * 20 pixels of the curve invisible.
   *
   * This property is useful for trimming the curve using a fixed distance.
   * If you want to animate the curve appearing on the screen, use {@link end}
   * instead.
   */
  @initial(0)
  @signal()
  public declare readonly endOffset: SimpleSignal<number, this>;

  /**
   * Whether to display an arrow at the end of the visible curve.
   *
   * @remarks
   * If `true`, a default arrow will be drawn. The size of the arrow can be
   * controlled with {@link arrowSize}.
   * If set to a {@link Node}, the node will be used as the arrow. If a custom
   * arrow is used, the {@link arrowSize} signal will be ignored.
   **/
  @initial(false)
  @signal()
  public declare readonly endArrow: SimpleSignal<Node | boolean, this>;

  /**
   * Controls the size of the end and start arrows.
   *
   * @remarks
   * To make the arrows visible make sure to enable {@link startArrow} and/or
   * {@link endArrow}.
   */
  @initial(24)
  @signal()
  public declare readonly arrowSize: SimpleSignal<number, this>;

  protected canHaveSubpath = false;

  protected override desiredSize(): SerializedVector2<DesiredLength> {
    return this.childrenBBox().size;
  }

  public constructor(props: CurveProps) {
    super(props);
  }

  protected abstract childrenBBox(): BBox;

  public abstract profile(): CurveProfile;

  /**
   * Convert a percentage along the curve to a distance.
   *
   * @remarks
   * The returned distance is given in relation to the full curve, not
   * accounting for {@link startOffset} and {@link endOffset}.
   *
   * @param value - The percentage along the curve.
   */
  public percentageToDistance(value: number): number {
    return clamp(
      0,
      this.baseArcLength(),
      this.startOffset() + this.offsetArcLength() * value,
    );
  }

  /**
   * Convert a distance along the curve to a percentage.
   *
   * @remarks
   * The distance should be given in relation to the full curve, not
   * accounting for {@link startOffset} and {@link endOffset}.
   *
   * @param value - The distance along the curve.
   */
  public distanceToPercentage(value: number): number {
    return (value - this.startOffset()) / this.offsetArcLength();
  }

  /**
   * The base arc length of this curve.
   *
   * @remarks
   * This is the entire length of this curve, not accounting for
   * {@link startOffset | the offsets}.
   */
  public baseArcLength() {
    return this.profile().arcLength;
  }

  /**
   * The offset arc length of this curve.
   *
   * @remarks
   * This is the length of the curve that accounts for
   * {@link startOffset | the offsets}.
   */
  public offsetArcLength() {
    const startOffset = this.startOffset();
    const endOffset = this.endOffset();
    const baseLength = this.baseArcLength();
    return clamp(0, baseLength, baseLength - startOffset - endOffset);
  }

  /**
   * The visible arc length of this curve.
   *
   * @remarks
   * This arc length accounts for both the offset and the {@link start} and
   * {@link end} properties.
   */
  @computed()
  public arcLength() {
    return this.offsetArcLength() * Math.abs(this.start() - this.end());
  }

  /**
   * The percentage of the curve that's currently visible.
   *
   * @remarks
   * The returned value is the ratio between the visible length (as defined by
   * {@link start} and {@link end}) and the offset length of the curve.
   */
  public completion(): number {
    return Math.abs(this.start() - this.end());
  }

  protected processSubpath(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _path: Path2D,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _startPoint: Vector2 | null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _endPoint: Vector2 | null,
  ) {
    // do nothing
  }

  @computed()
  protected curveDrawingInfo(): CurveDrawingInfo {
    const path = new Path2D();
    let subpath = new Path2D();
    const profile = this.profile();

    let start = this.percentageToDistance(this.start());
    let end = this.percentageToDistance(this.end());
    if (start > end) {
      [start, end] = [end, start];
    }

    const distance = end - start;
    const startArrow = this.startArrow();
    const endArrow = this.endArrow();

    const startArrowSize = Math.min(
      distance / 2,
      this.calculateArrowSize(startArrow),
    );
    const endArrowSize = Math.min(
      distance / 2,
      this.calculateArrowSize(endArrow),
    );

    if (startArrow) {
      start += startArrowSize / 2;
    }

    if (endArrow) {
      end -= endArrowSize / 2;
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

      if (
        this.canHaveSubpath &&
        endPoint &&
        !segment.getPoint(0).position.equals(endPoint)
      ) {
        path.addPath(subpath);
        this.processSubpath(subpath, startPoint, endPoint);
        subpath = new Path2D();
        startPoint = null;
      }

      const [startCurvePoint, endCurvePoint] = segment.draw(
        subpath,
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
      subpath.closePath();
    }
    this.processSubpath(subpath, startPoint, endPoint);
    path.addPath(subpath);

    return {
      startPoint: startPoint ?? Vector2.zero,
      startTangent: startTangent ?? Vector2.right,
      endPoint: endPoint ?? Vector2.zero,
      endTangent: endTangent ?? Vector2.right,
      startArrowSize,
      endArrowSize,
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

  private calculateArrowSize(arrow: Node | boolean): number {
    if (arrow instanceof Node) {
      return BBox.fromPoints(
        ...arrow.cacheBBox().transformCorners(arrow.localToParent()),
      ).width;
    }

    return this.arrowSize();
  }

  protected override drawShape(context: CanvasRenderingContext2D) {
    super.drawShape(context);
    const {
      startPoint,
      startTangent,
      endPoint,
      endTangent,
      startArrowSize,
      endArrowSize,
    } = this.curveDrawingInfo();

    if (startArrowSize < 0.001 && endArrowSize < 0.001) {
      return;
    }

    context.save();
    context.beginPath();

    const startArrow = this.startArrow();
    const endArrow = this.endArrow();

    if (endArrowSize >= 0.001 && endArrow) {
      this.drawArrowHead(context, endArrow, endPoint, endTangent, endArrowSize);
    }

    if (startArrowSize >= 0.001 && startArrow) {
      this.drawArrowHead(
        context,
        startArrow,
        startPoint,
        startTangent,
        startArrowSize,
        true,
      );
    }

    context.fillStyle = resolveCanvasStyle(this.stroke(), context);
    context.closePath();
    context.fill();
    context.restore();
  }

  private drawArrowHead(
    context: CanvasRenderingContext2D,
    arrow: Node | boolean,
    center: Vector2,
    tangent: Vector2,
    arrowSize: number,
    start = false,
  ): void {
    if (arrow instanceof Node) {
      this.drawArrowNode(context, arrow, arrowSize, center, tangent, start);
    } else {
      this.drawArrow(
        context,
        center,
        start ? tangent : tangent.flipped,
        arrowSize,
      );
    }
  }

  private drawArrow(
    context: CanvasRenderingContext2D,
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
    arrowSize: number,
    arrowPoint: Vector2,
    tangent: Vector2,
    flipped: boolean,
  ) {
    const scale = arrowSize / this.calculateArrowSize(arrow);

    context.save();
    context.translate(arrowPoint.x, arrowPoint.y);
    context.rotate(tangent.radians);
    context.scale(scale * (flipped ? -1 : 1), scale);

    arrow.render(context);

    context.restore();
  }
}
