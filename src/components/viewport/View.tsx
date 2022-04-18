import styles from './Viewport.module.scss';

import {useDocumentEvent, useDrag, usePlayer, useStorage} from '../../hooks';
import {useCallback, useEffect, useRef} from 'preact/hooks';

const ZOOM_SPEED = 0.1;
const konvaContainer = document.getElementById('konva');

export function View() {
  const player = usePlayer();
  const containerRef = useRef<HTMLDivElement>();
  const viewportRef = useRef<HTMLDivElement>();

  const [state, setState] = useStorage('viewport', {
    x: 0,
    y: 0,
    zoom: 1,
    grid: false,
  });

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
    1,
  );

  useEffect(() => {
    const {current} = viewportRef;
    current.appendChild(konvaContainer);
    konvaContainer.hidden = false;

    return () => konvaContainer.remove();
  }, [viewportRef.current]);

  useDocumentEvent(
    'keydown',
    useCallback(
      event => {
        switch (event.key) {
          case '0':
            const rect = containerRef.current.getBoundingClientRect();
            const size = player.project.size();
            let zoom = rect.height / size.height;
            if (size.width * zoom > rect.width) {
              zoom = rect.width / size.width;
            }
            setState({...state, zoom, x: 0, y: 0});
            break;
          case '=':
            setState({...state, zoom: state.zoom * (1 + ZOOM_SPEED)});
            break;
          case '-':
            setState({...state, zoom: state.zoom * (1 - ZOOM_SPEED)});
            break;
          case "'":
            setState({...state, grid: !state.grid});
            this.update();
            break;
        }
      },
      [setState, state],
    ),
  );

  return (
    <div
      className={styles.viewport}
      ref={containerRef}
      onMouseDown={handleDrag}
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
    </div>
  );
}
