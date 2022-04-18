import {useCallback, useState} from 'preact/hooks';
import {useDocumentEvent} from './useDocumentEvent';

interface MoveCallback {
  (dx: number, dy: number, x: number, y: number): any;
}

export function useDrag(
  onMove: MoveCallback,
  button = 0,
): [(event: MouseEvent) => any, boolean] {
  const [isDragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({x: 0, y: 0});
  useDocumentEvent(
    'mouseup',
    useCallback(
      event => {
        event.stopPropagation();
        setDragging(false);
      },
      [setDragging],
    ),
    isDragging,
    true,
  );

  useDocumentEvent(
    'mousemove',
    useCallback(
      event => {
        onMove(
          event.x - startPosition.x,
          event.y - startPosition.y,
          event.x,
          event.y,
        );
        setStartPosition({x: event.x, y: event.y});
      },
      [onMove, startPosition, setStartPosition],
    ),
    isDragging,
  );

  const handleDrag = useCallback(
    (event: MouseEvent) => {
      if (event.button !== button) return;
      event.preventDefault();
      event.stopPropagation();
      setStartPosition({x: event.x, y: event.y});
      setDragging(true);
    },
    [onMove, button, setDragging],
  );

  return [handleDrag, isDragging];
}
