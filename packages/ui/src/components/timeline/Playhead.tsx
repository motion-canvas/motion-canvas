import styles from './Timeline.module.scss';

import {usePlayerTime} from '../../hooks';
import {useTimelineContext} from '../../contexts';

export function Playhead() {
  const {framesToPixels} = useTimelineContext();
  const time = usePlayerTime();
  return (
    <div
      className={styles.playhead}
      data-frame={time.frame}
      style={{
        left: `${framesToPixels(time.frame)}px`,
      }}
    />
  );
}
