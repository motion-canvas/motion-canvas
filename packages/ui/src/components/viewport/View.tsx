import {useCallback, useEffect, useRef} from 'preact/hooks';

import {
  useCurrentScene,
  useDocumentEvent,
  useDrag,
  useSize,
  useStorage,
  useSubscribable,
  usePlayerState,
  useStateChange,
} from '../../hooks';
import {Debug} from './Debug';
import {Grid} from './Grid';
import styles from './Viewport.module.scss';
import {ViewportContext, ViewportState} from './ViewportContext';
import {isInspectable} from '@motion-canvas/core/lib/scenes/Inspectable';
import {useInspection, usePlayer} from '../../contexts';
import {highlight} from '../animations';

const ZOOM_SPEED = 0.1;

export function View() {
  const player = usePlayer();
  const scene = useCurrentScene();
  const containerRef = useRef<HTMLDivElement>();
  const viewportRef = useRef<HTMLCanvasElement>();
  const overlayRef = useRef<HTMLDivElement>();
  const size = useSize(containerRef);
  const playerState = usePlayerState();

  const [state, setState, wasStateLoaded] = useStorage<ViewportState>(
    'viewport',
    {
      width: 1920,
      height: 1080,
      x: 0,
      y: 0,
      zoom: 1,
      grid: false,
    },
  );
  const {setInspectedElement} = useInspection();

  const resetZoom = useCallback(() => {
    const rect = containerRef.current.getBoundingClientRect();
    const {width, height} = player.project.getSize();
    let zoom = rect.height / height;
    if (width * zoom > rect.width) {
      zoom = rect.width / width;
    }
    zoom /= playerState.scale;
    setState({...state, zoom, x: 0, y: 0});
  }, [state, player, playerState.scale]);

  const [handleDrag, isDragging] = useDrag(
    useCallback(
      (x, y) =>
        setState({
          ...state,
          x: state.x + x,
          y: state.y + y,
        }),
      [setState, state],
    ),
    undefined,
    null,
  );

  useEffect(() => {
    setState({
      ...state,
      width: size.width,
      height: size.height,
    });
  }, [size]);

  useEffect(() => {
    if (!wasStateLoaded) {
      resetZoom();
    }
  }, [wasStateLoaded]);

  useEffect(() => {
    player.project.setCanvas(viewportRef.current);
  }, [playerState.colorSpace]);

  useStateChange(
    ([scale]) => {
      const zoom = (state.zoom * scale) / playerState.scale;
      if (!isNaN(zoom) && zoom > 0) {
        setState({...state, zoom});
      }
    },
    [playerState.scale],
  );

  useSubscribable(
    player.onReloaded,
    () => overlayRef.current.animate(highlight(), {duration: 300}),
    [],
  );

  useDocumentEvent(
    'keydown',
    useCallback(
      event => {
        if (document.activeElement.tagName === 'INPUT') {
          return;
        }
        switch (event.key) {
          case '0': {
            resetZoom();
            break;
          }
          case '=':
            setState({...state, zoom: state.zoom * (1 + ZOOM_SPEED)});
            break;
          case '-':
            setState({...state, zoom: state.zoom * (1 - ZOOM_SPEED)});
            break;
          case "'":
            setState({...state, grid: !state.grid});
            break;
          case 'ArrowUp':
            // TODO Support hierarchy traversal.
            break;
          case 'ArrowDown': {
            // TODO Support hierarchy traversal.
            break;
          }
        }
      },
      [state, resetZoom],
    ),
  );

  return (
    <ViewportContext.Provider value={state}>
      <div
        className={styles.viewport}
        ref={containerRef}
        onContextMenu={event => {
          event.preventDefault();
        }}
        onMouseDown={event => {
          if (event.button === 0 && !event.shiftKey) {
            if (!isInspectable(scene)) return;

            const position = {
              x: event.x - size.x,
              y: event.y - size.y,
            };

            const projectSize = player.project.getSize();
            position.x -= state.x + size.width / 2;
            position.y -= state.y + size.height / 2;
            position.x /= state.zoom * playerState.scale;
            position.y /= state.zoom * playerState.scale;
            position.x += projectSize.width / 2;
            position.y += projectSize.height / 2;

            setInspectedElement(scene.inspectPosition(position.x, position.y));
          } else {
            handleDrag(event);
          }
        }}
        onWheel={event => {
          if (isDragging) return;
          const rect = containerRef.current.getBoundingClientRect();
          const pointer = {
            x: event.x - rect.x - rect.width / 2,
            y: event.y - rect.y - rect.height / 2,
          };

          const ratio = 1 - Math.sign(event.deltaY) * ZOOM_SPEED;
          setState({
            ...state,
            zoom: state.zoom * ratio,
            x: pointer.x + (state.x - pointer.x) * ratio,
            y: pointer.y + (state.y - pointer.y) * ratio,
          });
        }}
      >
        <div
          className={
            player.project.background
              ? styles.canvasOutline
              : styles.alphaBackground
          }
          style={{
            transform: `translate(${state.x}px, ${state.y}px) scale(${state.zoom})`,
            outlineWidth: `${1 / state.zoom}px`,
          }}
        >
          <canvas
            className={styles.preview}
            key={playerState.colorSpace}
            ref={viewportRef}
          />
        </div>
        <Grid />
        <Debug />
        <div ref={overlayRef} className={styles.overlay} />
      </div>
    </ViewportContext.Provider>
  );
}
