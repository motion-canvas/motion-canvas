import clsx from 'clsx';
import {ComponentChildren} from 'preact';
import {useCallback, useMemo, useRef} from 'preact/hooks';
import {ViewportProvider, ViewportState, useApplication} from '../../contexts';
import {
  useDocumentEvent,
  useDrag,
  usePreviewSettings,
  useSharedSettings,
  useSize,
  useStorage,
  useSubscribable,
  useSubscribableValue,
} from '../../hooks';
import {MouseButton} from '../../utils';
import {highlight} from '../animations';
import {Button, Select} from '../controls';
import {ButtonCheckbox} from '../controls/ButtonCheckbox';
import {Grid as GridIcon, Recenter} from '../icons';
import {ColorPicker} from './ColorPicker';
import {Coordinates} from './Coordinates';
import {Inspector} from './Inspector';
import {OverlayCanvas} from './OverlayCanvas';
import {PreviewStage} from './PreviewStage';
import styles from './Viewport.module.scss';

const ZOOM_SPEED = 0.1;

export function EditorPreview() {
  const {plugins, player, settings: appSettings} = useApplication();
  const coordinateSetting = useSubscribableValue(
    appSettings.appearance.coordinates.onChanged,
  );
  const containerRef = useRef<HTMLDivElement>();
  const overlayRef = useRef<HTMLDivElement>();
  const size = useSize(containerRef);
  const settings = {
    ...useSharedSettings(),
    ...usePreviewSettings(),
  };

  const [grid, setGrid] = useStorage('viewport-grid', false);
  const [zoomToFit, setZoomToFit] = useStorage('viewport-zoom-to-fill', true);
  const [zoom, setZoom] = useStorage('viewport-zoom', 1);
  const [position, setPosition] = useStorage('viewport-position', {
    x: 0,
    y: 0,
  });

  const inspector = useMemo(() => <Inspector />, []);
  const drawHooks = useMemo(
    () =>
      plugins.map(plugin => plugin.previewOverlay?.drawHook).filter(Boolean),
    [plugins],
  );

  const state: ViewportState = useMemo(() => {
    const state = {
      grid,
      rect: size,
      ...position,
      zoom,
      resolutionScale: settings.resolutionScale,
    };
    if (zoomToFit) {
      const {width, height} = settings.size;
      let newZoom = size.height / height;
      if (width * newZoom > size.width) {
        newZoom = size.width / width;
      }
      if (!isNaN(newZoom) && newZoom > 0 && newZoom < Infinity) {
        state.zoom = newZoom;
      }
      state.x = 0;
      state.y = 0;
    }

    return state;
  }, [grid, zoomToFit, zoom, position, settings, size]);

  const [handleDrag, isDragging] = useDrag(
    useCallback(
      (x, y) => {
        setZoomToFit(false);
        setZoom(state.zoom);
        setPosition({
          x: state.x + x,
          y: state.y + y,
        });
      },
      [state],
    ),
    undefined,
    null,
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
            setZoomToFit(true);
            break;
          }
          case '=':
            setZoomToFit(false);
            setZoom(state.zoom * (1 + ZOOM_SPEED));
            break;
          case '-':
            setZoomToFit(false);
            setZoom(state.zoom * (1 - ZOOM_SPEED));
            break;
          case "'":
            setGrid(!grid);
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
      [state.zoom, grid],
    ),
  );

  const zoomOptions = [
    {value: 0, text: 'Zoom to fit'},
    {value: 0.25, text: '25%'},
    {value: 0.5, text: '50%'},
    {value: 1, text: '100%'},
    {value: 2, text: '200%'},
  ];
  let value;
  if (zoomToFit) {
    value = 0;
  } else {
    value =
      zoomOptions.find(option => option.value === state.zoom)?.value ?? -1;
  }
  if (value === -1) {
    zoomOptions.unshift({
      value: -1,
      text: `Custom (${Math.floor(state.zoom * 100)}%)`,
    });
  }

  return (
    <ViewportProvider value={state}>
      <div
        className={clsx(styles.viewport, state.zoom > 1 && styles.pixelated)}
        ref={containerRef}
      >
        <PreviewStage
          style={{
            transform: `translate(${state.x}px, ${state.y}px) scale(${
              state.zoom / settings.resolutionScale
            })`,
          }}
        />
        <OverlayCanvas
          drawHooks={drawHooks}
          width={state.rect.width}
          height={state.rect.height}
        />
        <div
          ref={overlayRef}
          className={styles.overlay}
          onContextMenu={event => {
            event.preventDefault();
          }}
          onMouseDown={event => {
            if (
              event.button === MouseButton.Middle ||
              (event.button === MouseButton.Left && event.shiftKey)
            ) {
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
            setZoomToFit(false);
            setZoom(state.zoom * ratio);
            setPosition({
              x: pointer.x + (state.x - pointer.x) * ratio,
              y: pointer.y + (state.y - pointer.y) * ratio,
            });
          }}
        >
          {plugins.reduce((children, plugin) => {
            const Component = plugin.previewOverlay?.component;
            return Component ? <Component>{children}</Component> : children;
          }, undefined as ComponentChildren)}
        </div>
        <div className={clsx(styles.overlay, styles.controls)}>
          <Select
            title="Change zoom"
            onChange={value => {
              if (value === 0) {
                setZoomToFit(true);
              } else {
                setZoomToFit(false);
                setPosition({x: 0, y: 0});
                setZoom(value);
              }
            }}
            options={zoomOptions}
            value={value}
          />
          <Button
            disabled={state.x === 0 && state.y === 0}
            title={'Recenter'}
            onClick={() => setPosition({x: 0, y: 0})}
          >
            <Recenter />
          </Button>
          <ButtonCheckbox
            title={"Toggle grid [']"}
            onChecked={setGrid}
            checked={grid}
          >
            <GridIcon />
          </ButtonCheckbox>
          <ColorPicker />
          {coordinateSetting && <Coordinates />}
        </div>
        {inspector}
      </div>
    </ViewportProvider>
  );
}
