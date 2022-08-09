import styles from './Timeline.module.scss';

import type {Scene} from '@motion-canvas/core/lib/scenes';
import {usePlayerState, useScenes, useSubscribableValue} from '../../hooks';
import {usePlayer} from '../../contexts';

export function SceneTrack() {
  const scenes = useScenes();

  return (
    <div className={styles.sceneTrack}>
      {scenes.map(scene => (
        <SceneClip scene={scene} />
      ))}
    </div>
  );
}

interface SceneClipProps {
  scene: Scene;
}

function SceneClip({scene}: SceneClipProps) {
  const player = usePlayer();
  const state = usePlayerState();
  const cachedData = useSubscribableValue(scene.onCacheChanged);

  return (
    <div
      className={styles.sceneClip}
      data-name={scene.name}
      style={{
        width: `${(cachedData.duration / state.duration) * 100}%`,
        left: `${(cachedData.firstFrame / state.duration) * 100}%`,
      }}
      onMouseDown={event => {
        if (event.button === 1) {
          event.preventDefault();
        }
      }}
      onMouseUp={event => {
        if (event.button === 1) {
          event.stopPropagation();
          player.setRange(cachedData.firstFrame, cachedData.lastFrame - 1);
        }
      }}
    >
      <div className={styles.scene}>
        <div className={styles.sceneName}>{scene.name}</div>
      </div>
      {cachedData.transitionDuration > 0 && (
        <div
          style={{
            width: `${
              (cachedData.transitionDuration / cachedData.duration) * 100
            }%`,
          }}
          className={styles.transition}
        />
      )}
    </div>
  );
}
