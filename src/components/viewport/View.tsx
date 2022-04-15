import styles from './Viewport.module.scss';

import {useDocumentEvent, usePlayer, useStorage} from '../../hooks';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';

const ZOOM_SPEED = 0.1;
const konvaContainer = document.getElementById('konva');
konvaContainer.remove();

export function View() {
  const player = usePlayer();
  const [state, setState] = useStorage('viewport', {
    x: 0,
    y: 0,
    zoom: 1,
    grid: false,
  });

  const [isPanning, setPanning] = useState(false);
  const [startPosition, setStartPosition] = useState({x: 0, y: 0});
  const [panPosition, setPanPosition] = useState({x: 0, y: 0});
  const containerRef = useRef<HTMLDivElement>();
  const viewportRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const {current} = viewportRef;
    current.appendChild(konvaContainer);
    konvaContainer.hidden = false;

    return () => konvaContainer.remove();
  }, [viewportRef.current]);

  useDocumentEvent(
    'mouseup',
    useCallback(() => setPanning(false), [setPanning]),
  );

  useDocumentEvent(
    'mousemove',
    useCallback(
      event => {
        setState({
          ...state,
          x: startPosition.x - panPosition.x + event.x,
          y: startPosition.y - panPosition.y + event.y,
        });
      },
      [setState, state, startPosition, panPosition],
    ),
    isPanning,
  );

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
      onMouseDown={event => {
        if (event.button !== 1) return;
        event.preventDefault();
        setPanning(true);
        setStartPosition({x: state.x, y: state.y});
        setPanPosition({x: event.x, y: event.y});
      }}
      onWheel={event => {
        if (isPanning) return;
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
