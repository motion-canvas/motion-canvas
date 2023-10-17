import styles from './Timeline.module.scss';

import {useCallback, useLayoutEffect, useMemo, useRef} from 'preact/hooks';
import {
  useDocumentEvent,
  useDuration,
  usePreviewSettings,
  useSize,
  useStateChange,
  useStorage,
} from '../../hooks';
import {Playhead} from './Playhead';
import {Timestamps} from './Timestamps';
import {LabelTrack} from './LabelTrack';
import {SceneTrack} from './SceneTrack';
import {RangeSelector} from './RangeSelector';
import {clamp} from '../../utils';
import {AudioTrack} from './AudioTrack';
import {
  useApplication,
  TimelineContextProvider,
  TimelineState,
} from '../../contexts';
import clsx from 'clsx';
import {useShortcut} from '../../hooks/useShortcut';
import {labelClipDraggingLeftSignal} from '../../signals';
import { Module } from '../../contexts/shortcuts';

const ZOOM_SPEED = 0.1;
const ZOOM_MIN = 0.5;
const TIMESTAMP_SPACING = 32;
const MAX_FRAME_SIZE = 128;

export function Timeline() {
  const [hoverRef] = useShortcut<HTMLDivElement>(Module.Timeline);
  const {player} = useApplication();
  const containerRef = useRef<HTMLDivElement>();
  const playheadRef = useRef<HTMLDivElement>();
  const duration = useDuration();
  const {fps} = usePreviewSettings();
  const rect = useSize(containerRef);
  const [offset, setOffset] = useStorage('timeline-offset', 0);
  const [scale, setScale] = useStorage('timeline-scale', 1);
  const isReady = duration > 0;

  useLayoutEffect(() => {
    containerRef.current.scrollLeft = offset;
  }, [rect.width > 0 && isReady]);

  const sizes = useMemo(
    () => ({
      viewLength: rect.width,
      paddingLeft: rect.width / 2,
      fullLength: rect.width * scale + rect.width,
      playableLength: rect.width * scale,
    }),
    [rect.width, scale],
  );

  const zoomMax = (MAX_FRAME_SIZE / sizes.viewLength) * duration;

  const conversion = useMemo(
    () => ({
      framesToPixels: (value: number) =>
        (value / duration) * sizes.playableLength,
      framesToPercents: (value: number) => (value / duration) * 100,
      pixelsToFrames: (value: number) =>
        (value / sizes.playableLength) * duration,
    }),
    [duration, sizes],
  );

  const state = useMemo<TimelineState>(() => {
    const density = Math.pow(
      2,
      Math.round(Math.log2(duration / sizes.playableLength)),
    );
    const segmentDensity = Math.floor(TIMESTAMP_SPACING * density);
    const clampedSegmentDensity = Math.max(1, segmentDensity);
    const relativeOffset = offset - sizes.paddingLeft;
    const firstVisibleFrame =
      Math.floor(
        conversion.pixelsToFrames(relativeOffset) / clampedSegmentDensity,
      ) * clampedSegmentDensity;
    const lastVisibleFrame =
      Math.ceil(
        conversion.pixelsToFrames(
          relativeOffset + sizes.viewLength + TIMESTAMP_SPACING,
        ) / clampedSegmentDensity,
      ) * clampedSegmentDensity;

    return {
      viewLength: sizes.viewLength,
      offset: relativeOffset,
      firstVisibleFrame,
      lastVisibleFrame,
      density,
      segmentDensity,
      ...conversion,
    };
  }, [sizes, conversion, duration, offset]);

  useStateChange(
    ([prevDuration, prevWidth]) => {
      const newDuration = duration / fps;
      let newScale = scale;
      if (prevDuration !== 0 && newDuration !== 0) {
        newScale *= newDuration / prevDuration;
      }
      if (prevWidth !== 0 && rect.width !== 0) {
        newScale *= prevWidth / rect.width;
      }
      if (!isNaN(newScale) && duration > 0) {
        setScale(clamp(ZOOM_MIN, zoomMax, newScale));
      }
    },
    [duration / fps, rect.width],
  );

  useDocumentEvent(
    'keydown',
    useCallback(
      event => {
        if (document.activeElement.tagName === 'INPUT') {
          return;
        }
        if (event.key !== 'f') return;
        const frame = player.onFrameChanged.current;
        const maxOffset = sizes.fullLength - sizes.viewLength;
        const scrollLeft = state.framesToPixels(frame);
        const newOffset = clamp(0, maxOffset, scrollLeft);
        containerRef.current.scrollLeft = newOffset;
        setOffset(newOffset);
      },
      [sizes],
    ),
  );

  useLayoutEffect(() => {
    containerRef.current.scrollLeft = offset;
  }, [scale]);

  return (
    <TimelineContextProvider state={state}>
      <div ref={hoverRef} className={clsx(styles.root, isReady && styles.show)}>
        <div
          className={styles.timelineWrapper}
          ref={containerRef}
          onScroll={event =>
            setOffset((event.target as HTMLElement).scrollLeft)
          }
          onWheel={event => {
            const isVertical = Math.abs(event.deltaX) > Math.abs(event.deltaY);
            if (event.shiftKey || isVertical) return;
            event.preventDefault();

            let ratio = 1 - Math.sign(event.deltaY) * ZOOM_SPEED;
            let newScale = scale * ratio;
            if (newScale < ZOOM_MIN) {
              newScale = ZOOM_MIN;
              ratio = newScale / scale;
            }
            if (newScale > zoomMax) {
              newScale = zoomMax;
              ratio = newScale / scale;
            }
            if (newScale === scale) {
              return;
            }

            const pointer = offset - sizes.paddingLeft + event.x - rect.x;
            const newTrackSize = rect.width * newScale * +rect.width;
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
          onPointerDown={event => {
            if (event.button === 1) {
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              containerRef.current.style.cursor = 'grabbing';
            }
          }}
          onPointerMove={event => {
            if (labelClipDraggingLeftSignal.value) {
              playheadRef.current.style.left = `${
                state.framesToPixels(
                  player.status.secondsToFrames(
                    labelClipDraggingLeftSignal.value,
                  ),
                ) + sizes.paddingLeft
              }px`;
            } else {
              playheadRef.current.style.left = `${event.x - rect.x + offset}px`;
            }
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              const newOffset = clamp(
                0,
                sizes.playableLength,
                offset - event.movementX,
              );
              setOffset(newOffset);
              containerRef.current.scrollLeft = newOffset;
            }
          }}
          onPointerUp={event => {
            if (event.button === 1) {
              event.currentTarget.releasePointerCapture(event.pointerId);
              containerRef.current.style.cursor = '';
            }
          }}
        >
          <div
            className={styles.timeline}
            style={{width: `${sizes.fullLength}px`}}
            onMouseUp={event => {
              if (event.button === 0) {
                player.requestSeek(
                  Math.floor(
                    state.pixelsToFrames(
                      offset - sizes.paddingLeft + event.x - rect.x,
                    ),
                  ),
                );
              }
            }}
          >
            <div
              className={styles.timelineContent}
              style={{
                width: `${sizes.playableLength}px`,
                left: `${sizes.paddingLeft}px`,
              }}
            >
              <RangeSelector />
              <Timestamps />
              <div className={styles.trackContainer}>
                <SceneTrack />
                <LabelTrack />
                <AudioTrack />
              </div>
              <Playhead />
            </div>
          </div>
          <div ref={playheadRef} className={styles.playheadPreview} />
        </div>
      </div>
    </TimelineContextProvider>
  );
}
