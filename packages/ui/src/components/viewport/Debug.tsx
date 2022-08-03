import styles from './Viewport.module.scss';
import {useCurrentScene, usePlayerTime} from '../../hooks';
import {useContext, useLayoutEffect, useRef} from 'preact/hooks';
import {ViewportContext} from './ViewportContext';
import {AppContext} from '../../AppContext';
import {isInspectable} from '@motion-canvas/core/lib/scenes/Inspectable';

export function Debug() {
  const time = usePlayerTime();
  const scene = useCurrentScene();
  const canvasRef = useRef<HTMLCanvasElement>();
  const contextRef = useRef<CanvasRenderingContext2D>();
  const state = useContext(ViewportContext);
  const {inspectedElement, setInspectedElement} = useContext(AppContext);

  useLayoutEffect(() => {
    contextRef.current ??= canvasRef.current.getContext('2d');
    const ctx = contextRef.current;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (!isInspectable(scene)) return;

    const element = scene.validateInspection(inspectedElement);
    if (!element || element !== inspectedElement) {
      setInspectedElement(element);
      return;
    }

    ctx.save();
    ctx.translate(
      state.x + canvasRef.current.width / 2,
      state.y + canvasRef.current.height / 2,
    );
    ctx.scale(state.zoom, state.zoom);
    const {rect, position, contentRect, marginRect} =
      scene.inspectBoundingBox(element);

    if (contentRect && rect) {
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
    }

    if (rect) {
      ctx.beginPath();
      ctx.rect(rect.x, rect.y, rect.width, rect.height);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
      ctx.lineWidth = 2 / state.zoom;
      ctx.stroke();
    }

    if (marginRect && rect) {
      ctx.beginPath();
      ctx.rect(rect.x, rect.y, rect.width, rect.height);
      ctx.rect(marginRect.x, marginRect.y, marginRect.width, marginRect.height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,193,125,0.6)';
      ctx.fill('evenodd');
    }

    if (position) {
      ctx.beginPath();
      ctx.arc(position.x, position.y, 5 / state.zoom, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fill();
    }

    if (rect) {
      ctx.font = `${16 / state.zoom}px JetBrains Mono`;
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fillText(
        `${Math.floor(rect.width)} x ${Math.floor(rect.height)}`,
        rect.x + 8 / state.zoom,
        rect.y - 8 / state.zoom,
      );
    }

    ctx.restore();
  }, [state, scene, inspectedElement, time]);

  return (
    <canvas
      className={styles.overlay}
      ref={canvasRef}
      width={state.width}
      height={state.height}
    />
  );
}
