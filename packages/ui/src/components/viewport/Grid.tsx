import styles from './Viewport.module.scss';
import {useContext, useLayoutEffect, useMemo, useRef} from 'preact/hooks';
import {ViewportContext} from './ViewportContext';

const GRID_SIZE = 40;

export function Grid() {
  const canvasRef = useRef<HTMLCanvasElement>();
  const contextRef = useRef<CanvasRenderingContext2D>();
  const state = useContext(ViewportContext);

  const path = useMemo<Path2D>(() => {
    const path = new Path2D();
    const width = Math.ceil(state.width / 2 / GRID_SIZE + 2) * GRID_SIZE;
    const height = Math.ceil(state.height / 2 / GRID_SIZE + 2) * GRID_SIZE;

    for (let i = -width; i < width; i += GRID_SIZE) {
      path.moveTo(i, -height);
      path.lineTo(i, height);
    }
    for (let i = -height; i < height; i += GRID_SIZE) {
      path.moveTo(-width, i);
      path.lineTo(width, i);
    }
    path.closePath();
    return path;
  }, [state]);

  useLayoutEffect(() => {
    contextRef.current ??= canvasRef.current.getContext('2d');
    const ctx = contextRef.current;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (!state.grid) {
      return;
    }

    ctx.save();
    const scale = Math.pow(
      2,
      Math.log2(state.zoom) - Math.floor(Math.log2(state.zoom)),
    );
    ctx.translate(
      canvasRef.current.width / 2 + (state.x % (GRID_SIZE * scale)),
      canvasRef.current.height / 2 + (state.y % (GRID_SIZE * scale)),
    );
    ctx.scale(scale, scale);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.24)';
    ctx.lineWidth = 1 / scale;
    ctx.stroke(path);

    ctx.lineWidth = 1 / scale;
    ctx.setLineDash([0, 1.25, 2.5, 1.25]);
    ctx.translate(GRID_SIZE / 2, GRID_SIZE / 2);
    ctx.stroke(path);

    ctx.restore();
  }, [state, path]);

  return (
    <canvas
      className={styles.overlay}
      ref={canvasRef}
      width={state.width}
      height={state.height}
    />
  );
}
