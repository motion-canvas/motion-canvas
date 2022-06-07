import styles from './Viewport.module.scss';
import {usePlayer, usePlayerTime} from '../../hooks';
import {useContext, useLayoutEffect, useRef} from 'preact/hooks';
import {ViewportContext} from './ViewportContext';
import {NODE_ID} from '@motion-canvas/core/lib/symbols';

interface DebugProps {
  node: any;
  setNode: (value: any) => void;
}

export function Debug({node, setNode}: DebugProps) {
  const player = usePlayer();
  const time = usePlayerTime();
  const canvasRef = useRef<HTMLCanvasElement>();
  const contextRef = useRef<CanvasRenderingContext2D>();
  const state = useContext(ViewportContext);

  useLayoutEffect(() => {
    contextRef.current ??= canvasRef.current.getContext('2d');
    const ctx = contextRef.current;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (!node) {
      return;
    }
    if (!node.getLayer()) {
      const id = node.attrs[NODE_ID];
      setNode(player.project.findOne((node: any) => node.attrs[NODE_ID] === id));
      return;
    }

    ctx.save();
    ctx.translate(
      state.x + canvasRef.current.width / 2,
      state.y + canvasRef.current.height / 2,
    );
    ctx.scale(state.zoom, state.zoom);
    ctx.translate(player.project.width() / -2, player.project.height() / -2);

    const rect = node.getClientRect();
    const padding = node.getPadd();
    const margin = node.getMargin();
    const position = node.getAbsolutePosition();
    const offset = node.getOriginOffset();
    const scale = node.getAbsoluteScale();

    const contentRect = padding.scale(scale).shrink(rect);
    const marginRect = margin.scale(scale).expand(rect);

    ctx.beginPath();
    ctx.rect(
      contentRect.x,
      contentRect.y,
      contentRect.width,
      contentRect.height,
    );
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(180,255,147,0.6)';
    ctx.fill('evenodd');

    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
    ctx.lineWidth = 2 / state.zoom;
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.rect(marginRect.x, marginRect.y, marginRect.width, marginRect.height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,193,125,0.6)';
    ctx.fill('evenodd');

    ctx.beginPath();
    ctx.arc(position.x + offset.x, position.y + offset.y, 5 / state.zoom, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fill();

    ctx.font = `${16 / state.zoom}px JetBrains Mono`;
    ctx.fillText(
      `${Math.floor(rect.width)} x ${Math.floor(rect.height)}`,
      rect.x + 8 / state.zoom,
      rect.y - 8 / state.zoom,
    );

    ctx.restore();
  }, [state, node, time]);

  return (
    <canvas
      className={styles.overlay}
      ref={canvasRef}
      width={state.width}
      height={state.height}
    />
  );
}
