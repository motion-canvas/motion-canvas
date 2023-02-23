import styles from './Viewport.module.scss';

import {
  useCurrentScene,
  usePlayerTime,
  usePreviewSettings,
  useSharedSettings,
  useSubscribable,
} from '../../hooks';
import {
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import {ViewportContext} from './ViewportContext';
import {isInspectable} from '@motion-canvas/core/lib/scenes/Inspectable';
import {useInspection, useApplication} from '../../contexts';

export function Debug() {
  const time = usePlayerTime();
  const scene = useCurrentScene();
  const {player} = useApplication();
  const {resolutionScale} = usePreviewSettings();
  const {size} = useSharedSettings();
  const canvasRef = useRef<HTMLCanvasElement>();
  const contextRef = useRef<CanvasRenderingContext2D>();
  const state = useContext(ViewportContext);
  const {inspectedElement, setInspectedElement} = useInspection();
  const [renderCount, setRenderCount] = useState(0);

  const matrix = useMemo(() => {
    const matrix = new DOMMatrix();
    if (!size) {
      return matrix;
    }

    const offset = size.scale(-0.5);
    matrix.translateSelf(state.x + state.width / 2, state.y + state.height / 2);
    matrix.scaleSelf(
      state.zoom * resolutionScale,
      state.zoom * resolutionScale,
    );
    matrix.translateSelf(offset.width, offset.height);

    return matrix;
  }, [size, state, resolutionScale]);

  useSubscribable(
    player.onRecalculated,
    () => setRenderCount(renderCount + 1),
    [renderCount],
  );

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
  }, [matrix, renderCount, scene, inspectedElement, time]);

  return (
    <canvas
      className={styles.overlay}
      ref={canvasRef}
      width={state.width}
      height={state.height}
    />
  );
}
