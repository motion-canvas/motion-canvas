import styles from './Timeline.module.scss';

import {useContext, useMemo} from 'preact/hooks';
import {TimelineContext} from './TimelineContext';

export function TimestampTrack() {
  const {fullLength, startFrame, endFrame, density, duration} =
    useContext(TimelineContext);

  const timestamps = useMemo(() => {
    const timestamps = [];
    for (let i = startFrame; i < endFrame; i += density) {
      timestamps.push({
        time: i,
        style: {left: `${(i / duration) * fullLength}px`},
      });
    }
    return timestamps;
  }, [startFrame, endFrame, duration, fullLength, density]);

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
