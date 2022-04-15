import styles from './Timeline.module.scss';

import {usePlayerState} from '../../hooks';
import {useScenes} from '../../hooks/useScenes';

export function SceneTrack() {
  const scenes = useScenes();
  const state = usePlayerState();

  return (
    <div className={styles.sceneTrack}>
      {scenes.map(scene => (
        <div
          className={styles.sceneClip}
          data-name={scene.name()}
          style={{
            width: `${
              ((scene.lastFrame - scene.firstFrame) / state.duration) * 100
            }%`,
            left: `${(scene.firstFrame / state.duration) * 100}%`,
          }}
        />
      ))}
    </div>
  );
}
