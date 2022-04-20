import styles from './Timeline.module.scss';

import {usePlayer, usePlayerState, useScenes} from '../../hooks';

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
            width: `${(scene.duration / state.duration) * 100}%`,
            left: `${(scene.firstFrame / state.duration) * 100}%`,
          }}
          onMouseDown={event => {
            if (event.button === 1) {
              event.preventDefault();
            }
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
        >
          <div className={styles.scene}>
            <div className={styles.sceneName}>{scene.name()}</div>
          </div>
          {scene.transitionDuration > 0 && (
            <div
              style={{
                width: `${(scene.transitionDuration / scene.duration) * 100}%`,
              }}
              className={styles.transition}
            />
          )}
        </div>
      ))}
    </div>
  );
}
