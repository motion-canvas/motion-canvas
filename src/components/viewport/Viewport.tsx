import styles from './Viewport.module.scss';

import {PlaybackControls, PlaybackProgress} from '../playback';
import {View} from './View';
import {CurrentTime} from '../playback/CurrentTime';
import {usePlayerState} from '../../hooks';

export function Viewport() {
  const state = usePlayerState();
  console.log('update');
  return (
    <div className={styles.root}>
      <View />
      <PlaybackProgress />
      <div className={styles.playback}>
        <CurrentTime
          render={time => <div className={styles.time}>{time}</div>}
        />
        <PlaybackControls />
        <div className={styles.duration}>{state.duration}</div>
      </div>
    </div>
  );
}
