import styles from './Viewport.module.scss';

import {useCurrentScene, usePlayerState, usePlayerTime} from '../../hooks';
import {useContext, useLayoutEffect, useMemo, useRef} from 'preact/hooks';
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

  const matrix = useMemo(() => {
    const matrix = new DOMMatrix();
    if (!scene) {
      return matrix;
    }

    const size = scene.getSize().scale(-0.5);
    matrix.translateSelf(state.x + state.width / 2, state.y + state.height / 2);
    matrix.scaleSelf(state.zoom * scale, state.zoom * scale);
    matrix.translateSelf(size.width, size.height);

    return matrix;
  }, [scene, state, scale]);

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
    scene.drawOverlay(element, matrix, ctx);
    ctx.restore();
  }, [matrix, scene, inspectedElement, time]);

  return (
    <canvas
      className={styles.overlay}
      ref={canvasRef}
      width={state.width}
      height={state.height}
    />
  );
}
