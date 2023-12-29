import styles from './Timeline.module.scss';

import clsx from 'clsx';
import {useMemo} from 'preact/hooks';
import {useTimelineContext} from '../../contexts';

export function Timestamps() {
  const {
    framesToPercents,
    firstVisibleFrame,
    lastVisibleFrame,
    segmentDensity,
  } = useTimelineContext();

  const timestamps = useMemo(() => {
    const timestamps = [];
    const clamped = Math.max(1, segmentDensity);
    for (let i = firstVisibleFrame; i < lastVisibleFrame; i += clamped) {
      timestamps.push(
        <div
          className={clsx(styles.timestamp, {
            [styles.odd]: segmentDensity > 0 && (i / segmentDensity) % 2 !== 0,
          })}
          style={{left: `${framesToPercents(i)}%`}}
          key={i}
          data-frame={i}
        />,
      );
    }
    return timestamps;
  }, [firstVisibleFrame, lastVisibleFrame, framesToPercents, segmentDensity]);

  return <>{timestamps}</>;
}
