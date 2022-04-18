import styles from './Timeline.module.scss';

import {usePlayer, usePlayerState} from '../../hooks';
import {useScenes} from '../../hooks/useScenes';

export function SceneTrack() {
  const scenes = useScenes();
  const player = usePlayer();
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
          onMouseUp={event => {
            if (event.button === 1) {
              event.stopPropagation();
              player.updateState({
                startFrame: scene.firstFrame,
                endFrame: scene.lastFrame - 1,
              });
            }
          }}
        />
      ))}
    </div>
  );
}
