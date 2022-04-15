import styles from './Timeline.module.scss';

import {usePlayer, usePlayerState} from '../../hooks';

export function LabelTrack() {
  const player = usePlayer();
  const state = usePlayerState();

  return (
    <div className={styles.labelTrack}>
      {Object.entries(player.labels).map(([name, time]) => (
        <div
          className={styles.labelClip}
          data-name={name}
          style={{
            left: `${
              (player.project.secondsToFrames(time) / state.duration) * 100
            }%`,
          }}
          onClick={event => {
            event.stopPropagation();
            player.requestSeek(player.project.secondsToFrames(time));
          }}
        />
      ))}
    </div>
  );
}
