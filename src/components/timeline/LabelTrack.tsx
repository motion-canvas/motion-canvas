import styles from './Timeline.module.scss';

import {usePlayerState, useScenes} from '../../hooks';
import {useMemo} from 'preact/hooks';
import {LabelGroup} from './LabelGroup';

interface LabelTrackProps {
  fullLength: number;
  viewLength: number;
  offset: number;
  scale: number;
}

export function LabelTrack({
  fullLength,
  viewLength,
  offset,
  scale,
}: LabelTrackProps) {
  const scenes = useScenes();
  const state = usePlayerState();

  // FIXME Use Context
  const power = Math.pow(
    2,
    Math.round(Math.log2(state.duration / scale / viewLength)),
  );
  const density = Math.max(1, Math.floor(128 * power));
  const startFrame =
    Math.floor(((offset / fullLength) * state.duration) / density) * density;
  const endFrame =
    Math.ceil(
      (((offset + viewLength) / fullLength) * state.duration) / density,
    ) * density;

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
        <LabelGroup key={scene.name()} scene={scene} fullLength={fullLength} />
      ))}
    </div>
  );
}
