export function getContext(
  options?: CanvasRenderingContext2DSettings,
  canvas: HTMLCanvasElement = document.createElement('canvas'),
): CanvasRenderingContext2D {
  const context = canvas.getContext('2d', options);
  if (!context) {
    throw new Error('Could not create a 2D context.');
  }
  return context;
}
