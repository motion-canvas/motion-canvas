import styles from './Timeline.module.scss';

import {usePlayerTime} from '../../hooks';
import {useContext} from 'preact/hooks';
import {TimelineContext} from './TimelineContext';

export function Playhead() {
  const {fullLength} = useContext(TimelineContext);
  const time = usePlayerTime();
  return (
    <div
      className={styles.playhead}
      style={{
        left: `${fullLength * time.completion}px`,
      }}
    />
  );
}
