import {CanvasStyle, Gradient, Pattern, PossibleCanvasStyle} from '../partials';
import {Color, Rect, Spacing, Vector2} from '@motion-canvas/core/lib/types';

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
  radius: Spacing,
  smoothCorners: boolean,
  cornerSharpness: number,
) {
  if (
    radius.top === 0 &&
    radius.right === 0 &&
    radius.bottom === 0 &&
    radius.left === 0
  ) {
    drawRect(context, rect);
    return;
  }

  const topLeft = adjustRectRadius(radius.top, radius.right, radius.left, rect);
  const topRight = adjustRectRadius(
    radius.right,
    radius.top,
    radius.bottom,
    rect,
  );
  const bottomRight = adjustRectRadius(
    radius.bottom,
    radius.left,
    radius.right,
    rect,
  );
  const bottomLeft = adjustRectRadius(
    radius.left,
    radius.bottom,
    radius.top,
    rect,
  );

  if (smoothCorners === true) {
    const sharpness = (radius: number): number => {
      const val = radius * cornerSharpness;
      return radius - val;
    };

    context.moveTo(rect.left + topLeft, rect.top);
    context.lineTo(rect.right - topRight, rect.top);

    context.bezierCurveTo(
      rect.right - sharpness(topRight),
      rect.top,
      rect.right,
      rect.top + sharpness(topRight),
      rect.right,
      rect.top + topRight,
    );
    context.lineTo(rect.right, rect.bottom - bottomRight);

    context.bezierCurveTo(
      rect.right,
      rect.bottom - sharpness(bottomRight),
      rect.right - sharpness(bottomRight),
      rect.bottom,
      rect.right - bottomRight,
      rect.bottom,
    );
    context.lineTo(rect.left + bottomRight, rect.bottom);

    context.bezierCurveTo(
      rect.left + sharpness(bottomLeft),
      rect.bottom,
      rect.left,
      rect.bottom - sharpness(bottomLeft),
      rect.left,
      rect.bottom - bottomLeft,
    );
    context.lineTo(rect.left, rect.top + topLeft);

    context.bezierCurveTo(
      rect.left,
      rect.top + sharpness(topLeft),
      rect.left + sharpness(topLeft),
      rect.top,
      rect.left + topLeft,
      rect.top,
    );
    return;
  }

  context.moveTo(rect.left + topLeft, rect.top);
  context.arcTo(rect.right, rect.top, rect.right, rect.bottom, topRight);
  context.arcTo(rect.right, rect.bottom, rect.left, rect.bottom, bottomRight);
  context.arcTo(rect.left, rect.bottom, rect.left, rect.top, bottomLeft);
  context.arcTo(rect.left, rect.top, rect.right, rect.top, topLeft);
}

function adjustRectRadius(
  radius: number,
  horizontal: number,
  vertical: number,
  rect: Rect,
): number {
  const width =
    radius + horizontal > rect.width
      ? rect.width * (radius / (radius + horizontal))
      : radius;
  const height =
    radius + vertical > rect.height
      ? rect.height * (radius / (radius + vertical))
      : radius;

  return Math.min(width, height);
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

export function arc(
  context: CanvasRenderingContext2D | Path2D,
  center: Vector2,
  radius: number,
  startAngle = 0,
  endAngle = Math.PI * 2,
  counterclockwise = false,
) {
  context.arc(
    center.x,
    center.y,
    radius,
    startAngle,
    endAngle,
    counterclockwise,
  );
}
