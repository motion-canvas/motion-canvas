import styles from './Timeline.module.scss';

import {useDrag, usePlayerState} from '../../hooks';
import {useCallback, useContext, useEffect, useState} from 'preact/hooks';
import {Icon, IconType} from '../controls';
import {TimelineContext} from './TimelineContext';
import {usePlayer} from '../../contexts';

export function RangeTrack() {
  const {fullLength} = useContext(TimelineContext);

  const player = usePlayer();
  const state = usePlayerState();
  const [start, setStart] = useState(state.startFrame);
  const [end, setEnd] = useState(state.endFrame);

  const onDrop = useCallback(() => {
    player.setRange(Math.floor(start), Math.floor(end));
  }, [start, end, state.duration]);

  const [handleDragStart] = useDrag(
    useCallback(
      dx => {
        setStart(start + (dx / fullLength) * state.duration);
      },
      [start, fullLength, state.duration],
    ),
    onDrop,
  );

  const [handleDragEnd] = useDrag(
    useCallback(
      dx => {
        setEnd(
          Math.min(state.duration, end) + (dx / fullLength) * state.duration,
        );
      },
      [end, fullLength, state.duration],
    ),
    onDrop,
  );

  const [handleDrag] = useDrag(
    useCallback(
      dx => {
        setStart(start + (dx / fullLength) * state.duration);
        setEnd(
          Math.min(state.duration, end) + (dx / fullLength) * state.duration,
        );
      },
      [start, end, fullLength, state.duration],
    ),
    onDrop,
  );

  useEffect(() => {
    setStart(state.startFrame);
    setEnd(state.endFrame);
  }, [state.startFrame, state.endFrame]);

  let normalizedStart = start;
  let normalizedEnd = end;
  if (start > end) {
    normalizedStart = end;
    normalizedEnd = start;
  }

  return (
    <div
      style={{
        flexDirection: start > end ? 'row-reverse' : 'row',
        left: `${(Math.max(0, normalizedStart) / state.duration) * 100}%`,
        right: `${
          100 - Math.min(1, (normalizedEnd + 1) / state.duration) * 100
        }%`,
      }}
      className={styles.range}
      onMouseDown={event => {
        if (event.button === 1) {
          event.preventDefault();
          player.setRange(0, Infinity);
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
      <div class={styles.handleSpacer} />
      <Icon
        onMouseDown={handleDragEnd}
        onDblClick={console.log}
        className={styles.handle}
        type={IconType.dragIndicator}
      />
    </div>
  );
}
