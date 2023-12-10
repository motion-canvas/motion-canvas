import styles from './Timeline.module.scss';

import {Signal} from '@preact/signals';
import {useTimelineContext} from '../../contexts';
import {usePlayerState, usePlayerTime} from '../../hooks';

interface PlayheadProps {
  seeking: Signal<number | null>;
}

export function Playhead({seeking}: PlayheadProps) {
  const {framesToPixels} = useTimelineContext();
  const {speed} = usePlayerState();
  const time = usePlayerTime();
  const frame = seeking.value ?? time.frame;

  return (
    <div
      className={styles.playhead}
      data-frame={formatFrames(frame, speed)}
      style={{
        left: `${framesToPixels(frame)}px`,
      }}
    />
  );
}

function formatFrames(frames: number, speed: number) {
  const round = speed % 1 === 0;
  if (round) {
    return frames;
  } else {
    return frames.toFixed(2);
  }
}
