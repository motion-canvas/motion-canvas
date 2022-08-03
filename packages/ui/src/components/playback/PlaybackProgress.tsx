import styles from './Playback.module.scss';

import {usePlayerTime} from '../../hooks';

export function PlaybackProgress() {
  const state = usePlayerTime();

  return (
    <div className={styles.progress}>
      <div
        className={styles.progressFill}
        style={{width: `${state.completion * 100}%`}}
      />
    </div>
  );
}
