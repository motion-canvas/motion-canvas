import styles from './Timeline.module.scss';

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
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
import {RangeTrack} from './RangeTrack';
import {TimelineContext, TimelineState} from './TimelineContext';
import {clamp} from '@motion-canvas/core/lib/tweening';
import {AudioTrack} from './AudioTrack';

const ZOOM_SPEED = 0.1;

function useStateChange<T>(state: T, onChange: (prev: T, next: T) => void) {
  const [cached, setCached] = useState(state);
  useLayoutEffect(() => {
    if (state !== cached) {
      onChange(cached, state);
      setCached(state);
    }
  }, [cached, state, onChange]);
}

export function Timeline() {
  const player = usePlayer();
  const containerRef = useRef<HTMLDivElement>();
  const playheadRef = useRef<HTMLDivElement>();
  const {duration} = usePlayerState();
  const rect = useSize(containerRef);
  const [offset, setOffset] = useState(0);
  const [scale, setScale] = useState(1);

  const state = useMemo<TimelineState>(() => {
    const fullLength = rect.width * scale;
    const density = Math.pow(2, Math.round(Math.log2(duration / fullLength)));
    const segmentDensity = Math.max(1, Math.floor(128 * density));
    const startFrame =
      Math.floor(((offset / fullLength) * duration) / segmentDensity) *
      segmentDensity;
    const endFrame =
      Math.ceil(
        (((offset + rect.width) / fullLength) * duration) / segmentDensity,
      ) * segmentDensity;

    return {
      scale,
      offset,
      fullLength,
      viewLength: rect.width,
      startFrame,
      endFrame,
      density,
      segmentDensity,
      duration,
    };
  }, [rect.width, scale, duration, offset]);

  useStateChange(
    duration,
    useCallback(
      (prev, next) => setScale(Math.max(1, (scale / prev) * next)),
      [scale],
    ),
  );

  useStateChange(
    rect.width,
    useCallback(
      (prev, next) => {
        if (next !== 0 && prev !== 0) {
          setScale(Math.max(1, (scale / next) * prev));
        }
      },
      [scale],
    ),
  );

  useDocumentEvent(
    'keydown',
    useCallback(
      event => {
        if (event.key !== 'f') return;
        const time = player.getTime();
        const maxOffset = state.fullLength - rect.width;
        const playheadPosition = state.fullLength * time.completion;
        const scrollLeft = playheadPosition - rect.width / 2;
        const newOffset = clamp(0, maxOffset, scrollLeft);
        containerRef.current.scrollLeft = newOffset;
        setOffset(newOffset);
      },
      [state.fullLength, rect, scale],
    ),
  );

  useLayoutEffect(() => {
    containerRef.current.scrollLeft = offset;
  }, [scale]);

  return (
    <TimelineContext.Provider value={state}>
      <div className={styles.root}>
        <div
          className={styles.timeline}
          ref={containerRef}
          onScroll={event =>
            setOffset((event.target as HTMLElement).scrollLeft)
          }
          onWheel={event => {
            if (event.shiftKey) return;

            const ratio = 1 - Math.sign(event.deltaY) * ZOOM_SPEED;
            const newScale = scale * ratio < 1 ? 1 : scale * ratio;

            const pointer = offset + event.x - rect.x;
            const newTrackSize = rect.width * newScale;
            const maxOffset = newTrackSize - rect.width;
            const newOffset = clamp(
              0,
              maxOffset,
              offset - pointer + pointer * ratio,
            );

            containerRef.current.scrollLeft = newOffset;
            setScale(newScale);
            setOffset(newOffset);
            playheadRef.current.style.left = `${
              event.x - rect.x + newOffset
            }px`;
          }}
          onMouseUp={event => {
            if (event.button === 0) {
              player.requestSeek(
                Math.floor(
                  ((offset + event.x - rect.x) / state.fullLength) * duration,
                ),
              );
            }
          }}
          onMouseMove={event => {
            playheadRef.current.style.left = `${event.x - rect.x + offset}px`;
          }}
        >
          <div
            className={styles.track}
            style={{width: `${state.fullLength}px`}}
          >
            <RangeTrack />
            <TimestampTrack />
            <SceneTrack />
            <LabelTrack />
            <AudioTrack />
          </div>
          <div ref={playheadRef} className={styles.playheadPreview} />
          <Playhead />
        </div>
      </div>
    </TimelineContext.Provider>
  );
}
