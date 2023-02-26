import styles from './Timeline.module.scss';

import type {Scene} from '@motion-canvas/core/lib/scenes';
import {useScenes, useSubscribableValue} from '../../hooks';
import {useApplication, useTimelineContext} from '../../contexts';
import {useMemo} from 'preact/hooks';
import {findAndOpenFirstUserFile} from '../../utils';

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
  const {player, meta} = useApplication();
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
          meta.shared.range.set([
            player.status.framesToSeconds(cachedData.firstFrame),
            player.status.framesToSeconds(cachedData.lastFrame),
          ]);
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
        <button
          className={styles.sceneName}
          style={nameStyle}
          title="Go to source"
          onMouseUp={async event => {
            event.stopPropagation();
            if (scene.creationStack) {
              await findAndOpenFirstUserFile(scene.creationStack);
            }
          }}
        >
          {scene.name}
        </button>
      </div>
    </div>
  );
}
