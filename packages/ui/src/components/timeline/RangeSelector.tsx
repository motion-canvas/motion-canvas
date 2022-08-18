import styles from './Timeline.module.scss';

import {useDrag, usePlayerState} from '../../hooks';
import {useCallback, useEffect, useState} from 'preact/hooks';
import {Icon, IconType} from '../controls';
import {usePlayer, useTimelineContext} from '../../contexts';

export function RangeSelector() {
  const {pixelsToFrames, framesToPercents} = useTimelineContext();

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
        setStart(start + pixelsToFrames(dx));
      },
      [start, pixelsToFrames],
    ),
    onDrop,
  );

  const [handleDragEnd] = useDrag(
    useCallback(
      dx => {
        setEnd(Math.min(state.duration, end) + pixelsToFrames(dx));
      },
      [end, pixelsToFrames, state.duration],
    ),
    onDrop,
  );

  const [handleDrag] = useDrag(
    useCallback(
      dx => {
        setStart(start + pixelsToFrames(dx));
        setEnd(Math.min(state.duration, end) + pixelsToFrames(dx));
      },
      [start, end, state.duration, pixelsToFrames],
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
        left: `${framesToPercents(Math.max(0, normalizedStart))}%`,
        right: `${
          100 - framesToPercents(Math.min(state.duration, normalizedEnd + 1))
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
        className={styles.handle}
        type={IconType.dragIndicator}
      />
    </div>
  );
}
