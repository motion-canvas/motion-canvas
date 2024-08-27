import styles from './Timeline.module.scss';

import {useSignal, useSignalEffect} from '@preact/signals';
import clsx from 'clsx';
import {useLayoutEffect, useMemo, useRef} from 'preact/hooks';
import {
  TimelineContextProvider,
  TimelineState,
  useApplication,
} from '../../contexts';
import {
  TIMELINE_SHORTCUTS,
  useShortcuts,
  useSurfaceShortcuts,
} from '../../contexts/shortcuts';
import {
  useDuration,
  usePreviewSettings,
  useReducedMotion,
  useSharedSettings,
  useSize,
  useStateChange,
  useStorage,
} from '../../hooks';
import {labelClipDraggingLeftSignal} from '../../signals';
import {MouseButton, MouseMask, clamp} from '../../utils';
import {borderHighlight} from '../animations';
import {AudioTrack} from './AudioTrack';
import {LabelTrack} from './LabelTrack';
import {Playhead} from './Playhead';
import {RangeSelector} from './RangeSelector';
import {SceneTrack} from './SceneTrack';
import {Timestamps} from './Timestamps';

const ZOOM_SPEED = 0.1;
const ZOOM_MIN = 0.5;
const TIMESTAMP_SPACING = 32;
const MAX_FRAME_SIZE = 128;

export function Timeline() {
  const shortcutRef = useSurfaceShortcuts<HTMLDivElement>(TIMELINE_SHORTCUTS);
  const {player, meta} = useApplication();
  const {range} = useSharedSettings();
  const containerRef = useRef<HTMLDivElement>();
  const playheadRef = useRef<HTMLDivElement>();
  const rangeRef = useRef<HTMLDivElement>();
  const duration = useDuration();
  const {fps} = usePreviewSettings();
  const rect = useSize(containerRef);
  const [offset, setOffset] = useStorage('timeline-offset', 0);
  const [scale, setScale] = useStorage('timeline-scale', 1);
  const reduceMotion = useReducedMotion();
  const seeking = useSignal<number | null>(null);
  const warnedAboutRange = useRef(false);
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
    const startPosition = sizes.paddingLeft + rect.x - offset;

    return {
      viewLength: sizes.viewLength,
      offset: relativeOffset,
      firstVisibleFrame,
      lastVisibleFrame,
      density,
      segmentDensity,
      pointerToFrames: (value: number) =>
        conversion.pixelsToFrames(value - startPosition),
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

  useShortcuts(TIMELINE_SHORTCUTS, {
    focusPlayhead: () => {
      const frame = player.onFrameChanged.current;
      const maxOffset = sizes.fullLength - sizes.viewLength;
      const scrollLeft = state.framesToPixels(frame);
      const newOffset = clamp(0, maxOffset, scrollLeft);
      containerRef.current.scrollLeft = newOffset;
      setOffset(newOffset);
    },
    moveRangeStart: () => {
      const frame = player.onFrameChanged.current;
      const end = player.status.secondsToFrames(range[1]);
      meta.shared.range.update(frame, end, duration, fps);
    },
    moveRangeEnd: () => {
      const frame = player.onFrameChanged.current;
      const start = player.status.secondsToFrames(range[0]);
      meta.shared.range.update(start, frame, duration, fps);
    },
  });

  useLayoutEffect(() => {
    containerRef.current.scrollLeft = offset;
  }, [scale]);

  useSignalEffect(() => {
    const offset = labelClipDraggingLeftSignal.value;
    if (offset !== null && playheadRef.current) {
      playheadRef.current.style.left = `${
        state.framesToPixels(player.status.secondsToFrames(offset)) +
        sizes.paddingLeft
      }px`;
    }
  });

  const scrub = (x: number) => {
    const frame = Math.floor(state.pointerToFrames(x));

    seeking.value = player.clampRange(frame);
    if (player.onFrameChanged.current !== frame) {
      player.requestSeek(frame);
    }

    const isInUserRange = player.isInUserRange(frame);
    const isOutOfRange = player.isInRange(frame) && !isInUserRange;
    if (!warnedAboutRange.current && !reduceMotion && isOutOfRange) {
      warnedAboutRange.current = true;
      rangeRef.current?.animate(borderHighlight(), {
        duration: 200,
      });
    }

    if (isInUserRange) {
      warnedAboutRange.current = false;
    }
  };

  return (
    <TimelineContextProvider state={state}>
      <div
        ref={shortcutRef}
        className={clsx(styles.root, isReady && styles.show)}
      >
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
            if (event.button === MouseButton.Left) {
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              playheadRef.current.style.display = 'none';
              scrub(event.x);
            } else if (event.button === MouseButton.Middle) {
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              containerRef.current.style.cursor = 'grabbing';
            }
          }}
          onPointerMove={event => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              if (event.buttons & MouseMask.Primary) {
                scrub(event.x);
              } else if (event.buttons & MouseMask.Auxiliary) {
                const newOffset = clamp(
                  0,
                  sizes.playableLength,
                  offset - event.movementX,
                );
                setOffset(newOffset);
                containerRef.current.scrollLeft = newOffset;
              }
            } else if (labelClipDraggingLeftSignal.value === null) {
              playheadRef.current.style.left = `${event.x - rect.x + offset}px`;
            }
          }}
          onPointerUp={event => {
            if (labelClipDraggingLeftSignal.value === null) {
              playheadRef.current.style.left = `${event.x - rect.x + offset}px`;
            }
            if (
              event.button === MouseButton.Left ||
              event.button === MouseButton.Middle
            ) {
              seeking.value = null;
              warnedAboutRange.current = false;
              event.currentTarget.releasePointerCapture(event.pointerId);
              containerRef.current.style.cursor = '';
              playheadRef.current.style.display = '';
            }
          }}
        >
          <div
            className={styles.timeline}
            style={{width: `${sizes.fullLength}px`}}
          >
            <div
              className={styles.timelineContent}
              style={{
                width: `${sizes.playableLength}px`,
                left: `${sizes.paddingLeft}px`,
              }}
            >
              <RangeSelector rangeRef={rangeRef} />
              <Timestamps />
              <div className={styles.trackContainer}>
                <SceneTrack />
                <LabelTrack />
                <AudioTrack />
              </div>
              <Playhead seeking={seeking} />
            </div>
          </div>
          <div ref={playheadRef} className={styles.playheadPreview} />
        </div>
      </div>
    </TimelineContextProvider>
  );
}
