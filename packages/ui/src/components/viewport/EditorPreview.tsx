import {useCallback, useEffect, useRef} from 'preact/hooks';

import {
  useCurrentScene,
  useDocumentEvent,
  useDrag,
  usePreviewSettings,
  useSharedSettings,
  useSize,
  useStateChange,
  useStorage,
  useSubscribable,
} from '../../hooks';
import {Debug} from './Debug';
import {Grid} from './Grid';
import styles from './Viewport.module.scss';
import {ViewportContext, ViewportState} from './ViewportContext';
import {isInspectable} from '@motion-canvas/core/lib/scenes/Inspectable';
import {useApplication, useInspection} from '../../contexts';
import {highlight} from '../animations';
import {PreviewStage} from './PreviewStage';

const ZOOM_SPEED = 0.1;

export function EditorPreview() {
  const {player} = useApplication();
  const scene = useCurrentScene();
  const containerRef = useRef<HTMLDivElement>();
  const overlayRef = useRef<HTMLDivElement>();
  const size = useSize(containerRef);
  const settings = {
    ...useSharedSettings(),
    ...usePreviewSettings(),
  };

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
    const {width, height} = size;
    let zoom = rect.height / height;
    if (width * zoom > rect.width) {
      zoom = rect.width / width;
    }
    zoom /= settings.resolutionScale;
    if (!isNaN(zoom) && zoom > 0 && zoom < Infinity) {
      setState({...state, zoom, x: 0, y: 0});
    }
  }, [state, player, settings.resolutionScale]);

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

  useStateChange(
    ([scale]) => {
      const zoom = (state.zoom * scale) / settings.resolutionScale;
      if (!isNaN(zoom) && zoom > 0) {
        setState({...state, zoom});
      }
    },
    [settings.resolutionScale],
  );

  useSubscribable(
    player.onRecalculated,
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

            position.x -= state.x + size.width / 2;
            position.y -= state.y + size.height / 2;
            position.x /= state.zoom * settings.resolutionScale;
            position.y /= state.zoom * settings.resolutionScale;
            position.x += settings.size.width / 2;
            position.y += settings.size.height / 2;

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
            settings.background?.alpha() === 1
              ? styles.canvasOutline
              : styles.alphaBackground
          }
          style={{
            transform: `translate(${state.x}px, ${state.y}px) scale(${state.zoom})`,
            outlineWidth: `${1 / state.zoom}px`,
          }}
        >
          <PreviewStage />
        </div>
        <Grid />
        <Debug />
        <div ref={overlayRef} className={styles.overlay} />
      </div>
    </ViewportContext.Provider>
  );
}
