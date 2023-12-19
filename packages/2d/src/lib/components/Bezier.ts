import {BBox, SerializedVector2, Vector2} from '@motion-canvas/core';
import {CurveProfile} from '../curves';
import {PolynomialSegment} from '../curves/PolynomialSegment';
import {computed} from '../decorators';
import {DesiredLength} from '../partials';
import {arc, drawLine, drawPivot, moveTo} from '../utils';
import {Curve} from './Curve';

export interface BezierOverlayInfo {
  curve: Path2D;
  handleLines: Path2D;
  controlPoints: Vector2[];
  startPoint: Vector2;
  endPoint: Vector2;
}

export abstract class Bezier extends Curve {
  public override profile(): CurveProfile {
    const segment = this.segment();
    return {
      segments: [segment],
      arcLength: segment.arcLength,
      minSin: 0,
    };
  }

  protected abstract segment(): PolynomialSegment;

  protected abstract overlayInfo(matrix: DOMMatrix): BezierOverlayInfo;

  @computed()
  protected childrenBBox(): BBox {
    return BBox.fromPoints(...this.segment().points);
  }

  protected override desiredSize(): SerializedVector2<DesiredLength> {
    return this.segment().getBBox().size;
  }

  protected override offsetComputedLayout(box: BBox): BBox {
    box.position = box.position.sub(this.segment().getBBox().center);
    return box;
  }

  public override drawOverlay(
    context: CanvasRenderingContext2D,
    matrix: DOMMatrix,
  ) {
    const size = this.computedSize();
    const box = this.childrenBBox().transformCorners(matrix);
    const offset = size.mul(this.offset()).scale(0.5).transformAsPoint(matrix);
    const overlayInfo = this.overlayInfo(matrix);

    context.lineWidth = 1;
    context.strokeStyle = 'white';
    context.fillStyle = 'white';

    // Draw the curve itself first so everything else gets drawn on top of it
    context.stroke(overlayInfo.curve);

    context.fillStyle = 'white';
    context.globalAlpha = 0.5;

    context.beginPath();
    context.stroke(overlayInfo.handleLines);

    context.globalAlpha = 1;
    context.lineWidth = 2;

    // Draw start and end points
    for (const point of [overlayInfo.startPoint, overlayInfo.endPoint]) {
      moveTo(context, point);
      context.beginPath();
      arc(context, point, 4);
      context.closePath();
      context.stroke();
      context.fill();
    }

    // Draw the control points
    context.fillStyle = 'black';
    for (const point of overlayInfo.controlPoints) {
      moveTo(context, point);
      context.beginPath();
      arc(context, point, 4);
      context.closePath();
      context.fill();
      context.stroke();
    }

    // Draw the offset marker
    context.lineWidth = 1;
    context.beginPath();
    drawPivot(context, offset);
    context.stroke();

    // Draw the bounding box
    context.beginPath();
    drawLine(context, box);
    context.closePath();
    context.stroke();
  }
}
