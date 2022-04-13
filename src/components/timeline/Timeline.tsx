import styles from './Timeline.module.scss';

import {useLayoutEffect, useMemo, useRef, useState} from 'preact/hooks';
import {usePlayer, usePlayerState, useSize} from '../../hooks';
import {Playhead} from './Playhead';

const ZOOM_SPEED = 0.1;

export function Timeline() {
  const player = usePlayer();
  const state = usePlayerState();
  const containerRef = useRef<HTMLDivElement>();
  const rect = useSize(containerRef);
  const [scroll, setScroll] = useState(0);
  const [scale, setScale] = useState(1);
  const [mouse, setMouse] = useState(0);

  const trackSize = rect.width * scale;
  const power = Math.pow(2, Math.round(Math.log2(scale)));
  let density = Math.floor(
    (Math.floor((state.duration * 20) / rect.width) * 10) / power,
  );
  density = density < 1 ? 1 : density;

  useLayoutEffect(() => {
    containerRef.current.scrollLeft = scroll;
  }, [scale]);

  const startFrame = Math.floor(
    ((scroll / trackSize) * state.duration) / density,
  );
  const endFrame = Math.ceil(
    (((scroll + rect.width) / trackSize) * state.duration) / density,
  );

  const timestamps = useMemo(() => {
    const timestamps = [];
    for (let i = startFrame; i < endFrame; i++) {
      timestamps.push({
        time: i * density,
        style: {left: `${((i * density) / state.duration) * trackSize}px`},
      });
    }
    return timestamps;
  }, [startFrame, endFrame, state.duration, trackSize, density]);

  return (
    <div
      className={styles.root}
      ref={containerRef}
      onScroll={event => setScroll((event.target as HTMLElement).scrollLeft)}
      onWheel={event => {
        const ratio = 1 - Math.sign(event.deltaY) * ZOOM_SPEED;
        const newScale = scale * ratio < 1 ? 1 : scale * ratio;

        const pointer = scroll + event.x - rect.x;
        const newScroll = scroll - pointer + pointer * ratio;
        const newTrackSize = rect.width * newScale;
        const maxOffset = newTrackSize - rect.width;

        containerRef.current.scrollLeft = newScroll;
        setScale(newScale);
        setScroll(
          newScroll < 0 ? 0 : newScroll > maxOffset ? maxOffset : newScroll,
        );
      }}
      onClick={event =>
        player.requestSeek(
          Math.floor(
            ((scroll + event.x - rect.x) / trackSize) * state.duration,
          ),
        )
      }
      onMouseMove={event => setMouse(event.x)}
    >
      <div className={styles.track} style={{width: `${trackSize}px`}}>
        <div className={styles.timestampTrack}>
          {timestamps.map(value => (
            <div
              className={styles.timestamp}
              style={value.style}
              key={value.time}
            >
              {value.time}
            </div>
          ))}
        </div>
      </div>
      <div
        className={styles.playheadPreview}
        style={{
          left: `${mouse - rect.x + scroll}px`,
        }}
      />
      <Playhead trackSize={trackSize} />
    </div>
  );
}
