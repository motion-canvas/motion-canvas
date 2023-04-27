import styles from './Timeline.module.scss';

import {
  useDrag,
  useDuration,
  usePreviewSettings,
  useSharedSettings,
} from '../../hooks';
import {useCallback, useEffect, useState} from 'preact/hooks';
import {useApplication, useTimelineContext} from '../../contexts';
import {DragIndicator} from '../icons';

export function RangeSelector() {
  const {pixelsToFrames, framesToPercents} = useTimelineContext();

  const {player, meta} = useApplication();
  const {range} = useSharedSettings();
  const {fps} = usePreviewSettings();
  const duration = useDuration();
  const startFrame = player.status.secondsToFrames(range[0]);
  const endFrame = Math.min(player.status.secondsToFrames(range[1]), duration);
  const [start, setStart] = useState(startFrame);
  const [end, setEnd] = useState(endFrame);

  const onDrop = useCallback(() => {
    meta.shared.range.update(start, end, duration, fps);
  }, [start, end, duration, fps]);

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
        setEnd(end + pixelsToFrames(dx));
      },
      [end, pixelsToFrames, duration],
    ),
    onDrop,
  );

  const [handleDrag] = useDrag(
    useCallback(
      dx => {
        setStart(start + pixelsToFrames(dx));
        setEnd(end + pixelsToFrames(dx));
      },
      [start, end, duration, pixelsToFrames],
    ),
    onDrop,
  );

  useEffect(() => {
    setStart(startFrame);
    setEnd(endFrame);
  }, [startFrame, endFrame, range[0], range[1]]);

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
        right: `${100 - framesToPercents(Math.min(duration, normalizedEnd))}%`,
      }}
      className={styles.range}
      onMouseDown={event => {
        if (event.button === 1) {
          event.preventDefault();
          meta.shared.range.update(0, Infinity, duration, fps);
        } else {
          handleDrag(event);
        }
      }}
    >
      <DragIndicator onMouseDown={handleDragStart} className={styles.handle} />
      <div class={styles.handleSpacer} />
      <DragIndicator onMouseDown={handleDragEnd} className={styles.handle} />
    </div>
  );
}
