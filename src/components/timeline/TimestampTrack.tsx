import styles from './Timeline.module.scss';

import {usePlayerState} from '../../hooks';
import {useMemo} from 'preact/hooks';

interface TimestampTrackProps {
  fullLength: number;
  viewLength: number;
  offset: number;
  scale: number;
}

export function TimestampTrack({
  fullLength,
  viewLength,
  offset,
  scale,
}: TimestampTrackProps) {
  const state = usePlayerState();
  const power = Math.pow(2, Math.round(Math.log2(scale)));
  const density = Math.max(
    1,
    Math.floor((Math.floor((state.duration * 20) / viewLength) * 10) / power),
  );

  const startFrame = Math.floor(
    ((offset / fullLength) * state.duration) / density,
  );
  const endFrame = Math.ceil(
    (((offset + viewLength) / fullLength) * state.duration) / density,
  );

  const timestamps = useMemo(() => {
    const timestamps = [];
    for (let i = startFrame; i < endFrame; i++) {
      timestamps.push({
        time: i * density,
        style: {left: `${((i * density) / state.duration) * fullLength}px`},
      });
    }
    return timestamps;
  }, [startFrame, endFrame, state.duration, fullLength, density]);

  return (
    <div className={styles.timestampTrack}>
      {timestamps.map(value => (
        <div className={styles.timestamp} style={value.style} key={value.time}>
          {value.time}
        </div>
      ))}
    </div>
  );
}
