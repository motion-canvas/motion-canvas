import {useCallback, useMemo} from 'preact/hooks';
import {useViewportContext} from '../../contexts';
import {makeEditorPlugin} from '../makeEditorPlugin';

const GRID_SIZE = 40;

export default makeEditorPlugin({
  name: '@motion-canvas/ui/grid',
  previewOverlay: {
    drawHook: () => {
      const state = useViewportContext();

      const path = useMemo(() => {
        const path = new Path2D();
        const width =
          Math.ceil(state.rect.width / 2 / GRID_SIZE + 2) * GRID_SIZE;
        const height =
          Math.ceil(state.rect.height / 2 / GRID_SIZE + 2) * GRID_SIZE;

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

      return useCallback(
        (ctx: CanvasRenderingContext2D) => {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          if (!state.grid) {
            return;
          }

          ctx.save();
          const scale = Math.pow(
            2,
            Math.log2(state.zoom) - Math.floor(Math.log2(state.zoom)),
          );
          ctx.translate(
            ctx.canvas.width / 2 + (state.x % (GRID_SIZE * scale)),
            ctx.canvas.height / 2 + (state.y % (GRID_SIZE * scale)),
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
        },
        [state, path],
      );
    },
  },
});
