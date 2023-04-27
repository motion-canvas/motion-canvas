import styles from './Timeline.module.scss';

import {usePlayerState, usePlayerTime} from '../../hooks';
import {useTimelineContext} from '../../contexts';

export function Playhead() {
  const {framesToPixels} = useTimelineContext();
  const {speed} = usePlayerState();
  const time = usePlayerTime();
  return (
    <div
      className={styles.playhead}
      data-frame={formatFrames(time.frame, speed)}
      style={{
        left: `${framesToPixels(time.frame)}px`,
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
