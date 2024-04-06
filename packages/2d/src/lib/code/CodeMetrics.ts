export interface CodeMetrics {
  content: string;
  newRows: number;
  endColumn: number;
  firstWidth: number;
  maxWidth: number;
  lastWidth: number;
}

export function measureString(
  context: CanvasRenderingContext2D,
  monoWidth: number,
  value: string,
): CodeMetrics {
  const lines = value.split('\n');
  const lastLine = lines[lines.length - 1];
  const firstWidth = Math.round(
    context.measureText(lines[0]).width / monoWidth,
  );
  let lastWidth = firstWidth;
  let maxWidth = firstWidth;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const width = Math.round(context.measureText(line).width / monoWidth);
    if (width > maxWidth) {
      maxWidth = width;
    }
  }

  if (lines.length > 0) {
    lastWidth = Math.round(context.measureText(lastLine).width / monoWidth);
  }

  return {
    content: value,
    newRows: lines.length - 1,
    endColumn: lastLine.length,
    firstWidth,
    maxWidth,
    lastWidth,
  };
}

export function isCodeMetrics(value: any): value is CodeMetrics {
  return value?.content !== undefined;
}
