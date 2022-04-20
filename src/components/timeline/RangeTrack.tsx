import styles from './Timeline.module.scss';

import {useDrag, usePlayer, usePlayerState} from '../../hooks';
import {useCallback, useEffect, useState} from 'preact/hooks';
import {Icon, IconType} from '../controls';

interface RangeTrackProps {
  fullLength: number;
  viewLength: number;
  offset: number;
  scale: number;
}

export function RangeTrack({fullLength}: RangeTrackProps) {
  const player = usePlayer();
  const state = usePlayerState();
  const [start, setStart] = useState(state.startFrame);
  const [end, setEnd] = useState(state.endFrame);

  const [handleDragStart, isDraggingStart] = useDrag(
    useCallback(
      dx => {
        setStart(start + (dx / fullLength) * state.duration);
      },
      [start, setStart, fullLength, state.duration],
    ),
  );

  const [handleDragEnd, isDraggingEnd] = useDrag(
    useCallback(
      dx => {
        setEnd(Math.min(state.duration, end) + (dx / fullLength) * state.duration);
      },
      [end, setEnd, fullLength, state.duration],
    ),
  );

  const [handleDrag, isDragging] = useDrag(
    useCallback(
      dx => {
        setStart(start + (dx / fullLength) * state.duration);
        setEnd(Math.min(state.duration, end) + (dx / fullLength) * state.duration);
      },
      [start, end, fullLength, state.duration, setStart, setEnd],
    ),
  );

  useEffect(() => {
    setStart(state.startFrame);
    setEnd(state.endFrame);
  }, [state.startFrame, state.endFrame]);

  useEffect(() => {
    if (!isDragging && !isDraggingStart && !isDraggingEnd) {
      const correctedStart = Math.max(0, Math.floor(start));
      const correctedEnd =
        end >= state.duration
          ? Infinity
          : Math.min(state.duration, Math.floor(end));
      setStart(correctedStart);
      setEnd(correctedEnd);

      player.updateState({
        startFrame: correctedStart,
        endFrame: correctedEnd,
      });
    }
  }, [isDragging, isDraggingStart, isDraggingEnd, start, end]);

  return (
    <div
      style={{
        left: `${(Math.max(0, start) / state.duration) * 100}%`,
        right: `${100 - Math.min(1, (end + 1) / state.duration) * 100}%`,
      }}
      className={styles.range}
      onMouseDown={event => {
        if (event.button === 1) {
          event.preventDefault();
          setStart(0);
          setEnd(Infinity);
        } else {
          handleDrag(event);
        }
      }}
    >
      <Icon
        onMouseDown={handleDragStart}
        className={styles.handle}
        type={IconType.dragIndicator}
      />
      <Icon
        onMouseDown={handleDragEnd}
        onDblClick={console.log}
        className={styles.handle}
        type={IconType.dragIndicator}
      />
    </div>
  );
}
