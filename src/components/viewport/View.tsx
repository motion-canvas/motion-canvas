import type {Container} from 'konva/lib/Container';
import {useCallback, useContext, useEffect, useRef} from 'preact/hooks';
import {AppContext} from '../../AppContext';

import {
  useDocumentEvent,
  useDrag,
  useEventEffect,
  usePlayer,
  useSize,
  useStorage,
} from '../../hooks';
import {Debug} from './Debug';
import {Grid} from './Grid';
import styles from './Viewport.module.scss';
import {ViewportContext, ViewportState} from './ViewportContext';

const ZOOM_SPEED = 0.1;

export function View() {
  const player = usePlayer();
  const containerRef = useRef<HTMLDivElement>();
  const viewportRef = useRef<HTMLDivElement>();
  const overlayRef = useRef<HTMLDivElement>();
  const size = useSize(containerRef);

  const [state, setState] = useStorage<ViewportState>('viewport', {
    width: 1920,
    height: 1080,
    x: 0,
    y: 0,
    zoom: 1,
    grid: false,
  });
  const {selectedNode, setSelectedNode} = useContext(AppContext);

  useEffect(() => {
    setState({
      ...state,
      width: size.width,
      height: size.height,
    });
  }, [size]);

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
    const {current} = viewportRef;
    current.appendChild(player.project.container());
    return () => player.project.container().remove();
  }, [viewportRef.current]);

  useEventEffect(
    player.Reloaded,
    () =>
      overlayRef.current.animate(
        [
          {
            boxShadow: '0 0 0px 0 #ccc inset',
            easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
          },
          {
            boxShadow: '0 0 0px 4px #ccc inset',
            easing: 'cubic-bezier(0.32, 0, 0.67, 0)',
          },
          {boxShadow: '0 0 0px 0 #ccc inset'},
        ],
        {
          duration: 300,
        },
      ),
    [],
  );

  useDocumentEvent(
    'keydown',
    useCallback(
      event => {
        switch (event.key) {
          case '0': {
            const rect = containerRef.current.getBoundingClientRect();
            const size = player.project.size();
            let zoom = rect.height / size.height;
            if (size.width * zoom > rect.width) {
              zoom = rect.width / size.width;
            }
            setState({...state, zoom, x: 0, y: 0});
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
            if (selectedNode?.parent) {
              setSelectedNode(selectedNode.parent);
            }
            break;
          case 'ArrowDown': {
            const container = selectedNode as Container;
            if (container?.children?.length) {
              setSelectedNode(container.children.at(-1));
            }
            break;
          }
        }
      },
      [setState, state, selectedNode],
    ),
  );

  return (
    <ViewportContext.Provider value={state}>
      <div
        className={styles.viewport}
        ref={containerRef}
        onMouseDown={event => {
          if (event.button === 0 && !event.shiftKey) {
            const position = {
              x: event.x - size.x,
              y: event.y - size.y,
            };

            position.x -= state.x + size.width / 2;
            position.y -= state.y + size.height / 2;
            position.x /= state.zoom;
            position.y /= state.zoom;
            position.x += player.project.width() / 2;
            position.y += player.project.height() / 2;

            player.project.listening(true);
            player.project.master.drawHit();
            const node = player.project.master.getIntersection(position);
            player.project.listening(false);
            setSelectedNode(node);
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
          style={{
            transform: `translate(${state.x}px, ${state.y}px) scale(${state.zoom})`,
          }}
          id={'viewport'}
          ref={viewportRef}
        />
        <Grid />
        <Debug node={selectedNode} setNode={setSelectedNode} />
        <div ref={overlayRef} className={styles.overlay} />
      </div>
    </ViewportContext.Provider>
  );
}
