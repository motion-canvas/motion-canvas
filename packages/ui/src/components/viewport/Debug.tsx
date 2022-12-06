import styles from './Viewport.module.scss';

import {useCurrentScene, usePlayerState, usePlayerTime} from '../../hooks';
import {useContext, useLayoutEffect, useRef} from 'preact/hooks';
import {ViewportContext} from './ViewportContext';
import {isInspectable} from '@motion-canvas/core/lib/scenes/Inspectable';
import {useInspection} from '../../contexts';

export function Debug() {
  const time = usePlayerTime();
  const scene = useCurrentScene();
  const {scale} = usePlayerState();
  const canvasRef = useRef<HTMLCanvasElement>();
  const contextRef = useRef<CanvasRenderingContext2D>();
  const state = useContext(ViewportContext);
  const {inspectedElement, setInspectedElement} = useInspection();

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

    const size = scene.getSize().scale(scale / -2);
    const matrix = new DOMMatrix();
    matrix.translateSelf(
      state.x + canvasRef.current.width / 2,
      state.y + canvasRef.current.height / 2,
    );
    matrix.scaleSelf(state.zoom, state.zoom);
    matrix.translateSelf(size.width, size.height);

    ctx.save();
    scene.drawOverlay(element, matrix, ctx);
    ctx.restore();
  }, [state, scene, inspectedElement, time, scale]);

  return (
    <canvas
      className={styles.overlay}
      ref={canvasRef}
      width={state.width}
      height={state.height}
    />
  );
}
