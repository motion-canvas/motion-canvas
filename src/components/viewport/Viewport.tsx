import styles from './Viewport.module.scss';

import {PlaybackControls, PlaybackProgress} from '../playback';
import {View} from './View';
import {CurrentTime} from '../playback/CurrentTime';
import {usePlayer, usePlayerState} from '../../hooks';

export function Viewport() {
  const player = usePlayer();
  const state = usePlayerState();
  return (
    <div className={styles.root}>
      <View />
      <PlaybackProgress />
      <div className={styles.playback}>
        <CurrentTime
          render={time => (
            <div className={styles.time}>
              {formatFrames(player.project.framesToSeconds(time))}
              <span className={styles.frames}>[{time}]</span>
            </div>
          )}
        />
        <PlaybackControls />
        <div className={styles.duration}>
          <span className={styles.frames}>[{state.duration}]</span>
          {formatFrames(player.project.framesToSeconds(state.duration))}
        </div>
      </div>
    </div>
  );
}

function formatFrames(duration: number) {
  const minutes = Math.floor(duration / 60) % 60;
  const seconds = Math.floor(duration % 60);

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}
