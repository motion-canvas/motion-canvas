import {CanvasStyle, Gradient, Pattern, PossibleCanvasStyle} from '../partials';
import {Color, Rect, Vector2} from '@motion-canvas/core/lib/types';

export function canvasStyleParser(style: PossibleCanvasStyle) {
  if (style === null) {
    return null;
  }
  if (style instanceof Gradient) {
    return style;
  }
  if (style instanceof Pattern) {
    return style;
  }

  return new Color(style);
}

export function resolveCanvasStyle(
  style: CanvasStyle,
  context: CanvasRenderingContext2D,
): string | CanvasGradient | CanvasPattern {
  if (style === null) {
    return '';
  }
  if (style instanceof Color) {
    return (<Color>style).serialize();
  }
  if (style instanceof Gradient) {
    return style.canvasGradient(context);
  }
  if (style instanceof Pattern) {
    return style.canvasPattern(context) ?? '';
  }

  return '';
}

export function drawRoundRect(
  context: CanvasRenderingContext2D | Path2D,
  rect: Rect,
  radius: number,
) {
  if (radius > 0) {
    const maxRadius = Math.min(rect.width / 2, rect.height / 2, radius);
    context.moveTo(rect.left + maxRadius, rect.top);
    context.arcTo(rect.right, rect.top, rect.right, rect.bottom, maxRadius);
    context.arcTo(rect.right, rect.bottom, rect.left, rect.bottom, maxRadius);
    context.arcTo(rect.left, rect.bottom, rect.left, rect.top, maxRadius);
    context.arcTo(rect.left, rect.top, rect.right, rect.top, maxRadius);
  } else {
    drawRect(context, rect);
  }
}

export function drawRect(
  context: CanvasRenderingContext2D | Path2D,
  rect: Rect,
) {
  context.rect(rect.x, rect.y, rect.width, rect.height);
}

export function fillRect(context: CanvasRenderingContext2D, rect: Rect) {
  context.fillRect(rect.x, rect.y, rect.width, rect.height);
}

export function strokeRect(context: CanvasRenderingContext2D, rect: Rect) {
  context.strokeRect(rect.x, rect.y, rect.width, rect.height);
}

export function drawImage(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  destination: Rect,
): void;
export function drawImage(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  source: Rect,
  destination: Rect,
): void;
export function drawImage(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  first: Rect,
  second?: Rect,
): void {
  if (second) {
    context.drawImage(
      image,
      first.x,
      first.y,
      first.width,
      first.height,
      second.x,
      second.y,
      second.width,
      second.height,
    );
  } else {
    context.drawImage(image, first.x, first.y, first.width, first.height);
  }
}

export function moveTo(
  context: CanvasRenderingContext2D | Path2D,
  position: Vector2,
) {
  context.moveTo(position.x, position.y);
}

export function lineTo(
  context: CanvasRenderingContext2D | Path2D,
  position: Vector2,
) {
  context.lineTo(position.x, position.y);
}

export function arcTo(
  context: CanvasRenderingContext2D | Path2D,
  through: Vector2,
  position: Vector2,
  radius: number,
) {
  context.arcTo(through.x, through.y, position.x, position.y, radius);
}

export function drawLine(
  context: CanvasRenderingContext2D | Path2D,
  points: Vector2[],
) {
  if (points.length < 2) return;
  moveTo(context, points[0]);
  for (const point of points.slice(1)) {
    lineTo(context, point);
  }
}
