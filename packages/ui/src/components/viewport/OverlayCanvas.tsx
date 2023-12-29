import clsx from 'clsx';
import {JSX} from 'preact';
import {useLayoutEffect, useRef, useState} from 'preact/hooks';
import {useApplication} from '../../contexts';
import {useSubscribable, useViewportMatrix} from '../../hooks';
import {PluginDrawFunction} from '../../plugin';
import styles from './Viewport.module.scss';

interface OverlayCanvasProps extends JSX.HTMLAttributes<HTMLCanvasElement> {
  drawHooks: (() => PluginDrawFunction)[];
}

export function OverlayCanvas({
  className,
  drawHooks,
  ...props
}: OverlayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>();
  const contextRef = useRef<CanvasRenderingContext2D>();
  const {player} = useApplication();
  const [renderCount, setRenderCount] = useState(0);

  const matrix = useViewportMatrix();
  const drawFunctions = drawHooks.map(hook => hook());

  useSubscribable(
    player.onRecalculated,
    () => setRenderCount(renderCount + 1),
    [renderCount],
  );

  useLayoutEffect(() => {
    contextRef.current ??= canvasRef.current.getContext('2d');
    const ctx = contextRef.current;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    for (const drawFunction of drawFunctions) {
      ctx.save();
      drawFunction(ctx, matrix);
      ctx.restore();
    }
  }, [drawFunctions, matrix, renderCount]);

  return (
    <canvas
      className={clsx(className, styles.overlay)}
      ref={canvasRef}
      {...props}
    />
  );
}
