import styles from './Timeline.module.scss';

import {usePlayerTime} from '../../hooks';

interface PlayheadProps {
  trackSize: number;
}

export function Playhead({trackSize}: PlayheadProps) {
  const time = usePlayerTime();
  return (
    <div
      className={styles.playhead}
      style={{
        left: `${trackSize * time.completion}px`,
      }}
    />
  );
}
