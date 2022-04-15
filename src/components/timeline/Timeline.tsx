import styles from './Timeline.module.scss';

import {useCallback, useLayoutEffect, useRef, useState} from 'preact/hooks';
import {
  useDocumentEvent,
  usePlayer,
  usePlayerState,
  useSize,
} from '../../hooks';
import {Playhead} from './Playhead';
import {TimestampTrack} from './TimestampTrack';
import {LabelTrack} from './LabelTrack';
import {SceneTrack} from './SceneTrack';

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

  useDocumentEvent(
    'keydown',
    useCallback(
      event => {
        if (event.key !== 'f') return;
        const time = player.getTime();
        const maxOffset = trackSize - rect.width;
        const playhead = trackSize * time.completion;
        const newScroll = playhead - rect.width / 2;
        setScroll(
          newScroll < 0 ? 0 : newScroll > maxOffset ? maxOffset : newScroll,
        );
        setScale(scale * 0.99);
      },
      [trackSize, rect, scale],
    ),
  );

  useLayoutEffect(() => {
    containerRef.current.scrollLeft = scroll;
  }, [scale]);

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
        <TimestampTrack
          fullLength={trackSize}
          viewLength={rect.width}
          offset={scroll}
          scale={scale}
        />
        <SceneTrack />
        <LabelTrack />
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
