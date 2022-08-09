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
  usePlayerState,
  useSize,
  useStateChange,
} from '../../hooks';
import {Playhead} from './Playhead';
import {TimestampTrack} from './TimestampTrack';
import {LabelTrack} from './LabelTrack';
import {SceneTrack} from './SceneTrack';
import {RangeTrack} from './RangeTrack';
import {TimelineContext, TimelineState} from './TimelineContext';
import {clamp} from '@motion-canvas/core/lib/tweening';
import {AudioTrack} from './AudioTrack';
import {usePlayer} from '../../contexts';

const ZOOM_SPEED = 0.1;

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
    ([prevDuration, prevWidth]) => {
      let newScale = scale;
      if (prevDuration !== 0 && duration !== 0) {
        newScale *= duration / prevDuration;
      }
      if (prevWidth !== 0 && rect.width !== 0) {
        newScale *= prevWidth / rect.width;
      }
      if (!isNaN(newScale)) {
        setScale(Math.max(1, newScale));
      }
    },
    [duration, rect.width],
  );

  useDocumentEvent(
    'keydown',
    useCallback(
      event => {
        if (event.key !== 'f') return;
        const frame = player.onFrameChanged.current;
        const maxOffset = state.fullLength - rect.width;
        const playheadPosition = (state.fullLength * frame) / duration;
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
            if (!isNaN(newScale)) {
              setScale(newScale);
            }
            if (!isNaN(newOffset)) {
              setOffset(newOffset);
            }
            playheadRef.current.style.left = `${
              event.x - rect.x + newOffset
            }px`;
          }}
          onClick={event => {
            player.requestSeek(
              Math.floor(
                ((offset + event.x - rect.x) / state.fullLength) * duration,
              ),
            );
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
