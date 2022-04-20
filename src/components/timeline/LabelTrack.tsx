import styles from './Timeline.module.scss';

import {useScenes} from '../../hooks';
import {useContext, useMemo} from 'preact/hooks';
import {LabelGroup} from './LabelGroup';
import {TimelineContext} from './TimelineContext';

export function LabelTrack() {
  const {startFrame, endFrame} = useContext(TimelineContext);
  const scenes = useScenes();
  const filtered = useMemo(
    () =>
      scenes.filter(
        scene => scene.lastFrame >= startFrame && scene.firstFrame <= endFrame,
      ),
    [scenes, startFrame, endFrame],
  );

  return (
    <div className={styles.labelTrack}>
      {filtered.map(scene => (
        <LabelGroup key={scene.name()} scene={scene} />
      ))}
    </div>
  );
}
