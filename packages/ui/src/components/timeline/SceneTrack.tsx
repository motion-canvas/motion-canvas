import styles from './Timeline.module.scss';

import type {Scene} from '@motion-canvas/core/lib/scenes';
import {useScenes, useSubscribableValue} from '../../hooks';
import {usePlayer, useTimelineContext} from '../../contexts';
import {useMemo} from 'preact/hooks';

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
  const {framesToPercents, framesToPixels, offset} = useTimelineContext();
  const cachedData = useSubscribableValue(scene.onCacheChanged);

  const nameStyle = useMemo(() => {
    const sceneOffset = framesToPixels(cachedData.firstFrame);
    return offset > sceneOffset
      ? {paddingLeft: `${offset - sceneOffset}px`}
      : {};
  }, [offset, cachedData.firstFrame, framesToPixels]);

  return (
    <div
      className={styles.sceneClip}
      data-name={scene.name}
      style={{
        width: `${framesToPercents(cachedData.duration)}%`,
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
        <div className={styles.sceneName} style={nameStyle}>
          {scene.name}
        </div>
      </div>
    </div>
  );
}
