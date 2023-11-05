import styles from './Timeline.module.scss';

import {useDuration, usePreviewSettings, useSharedSettings} from '../../hooks';
import {useCallback, useEffect, useState} from 'preact/hooks';
import {useApplication, useTimelineContext} from '../../contexts';
import {DragIndicator} from '../icons';
import {RefObject} from 'preact';

export interface RangeSelectorProps {
  rangeRef: RefObject<HTMLDivElement>;
}

export function RangeSelector({rangeRef}: RangeSelectorProps) {
  const {pixelsToFrames, framesToPercents} = useTimelineContext();

  const {player, meta} = useApplication();
  const {range} = useSharedSettings();
  const {fps} = usePreviewSettings();
  const duration = useDuration();
  const startFrame = player.status.secondsToFrames(range[0]);
  const endFrame = Math.min(player.status.secondsToFrames(range[1]), duration);
  const [start, setStart] = useState(startFrame);
  const [end, setEnd] = useState(endFrame);

  const onDrop = useCallback(() => {
    meta.shared.range.update(start, end, duration, fps);
  }, [start, end, duration, fps]);

  useEffect(() => {
    setStart(startFrame);
    setEnd(endFrame);
  }, [startFrame, endFrame, range[0], range[1]]);

  let normalizedStart = start;
  let normalizedEnd = end;
  if (start > end) {
    normalizedStart = end;
    normalizedEnd = start;
  }

  return (
    <div
      ref={rangeRef}
      style={{
        flexDirection: start > end ? 'row-reverse' : 'row',
        left: `${framesToPercents(Math.max(0, normalizedStart))}%`,
        right: `${100 - framesToPercents(Math.min(duration, normalizedEnd))}%`,
      }}
      className={styles.range}
      onPointerDown={event => {
        event.preventDefault();
        if (event.button === 0) {
          event.currentTarget.setPointerCapture(event.pointerId);
        } else if (event.button === 1) {
          event.stopPropagation();
          meta.shared.range.update(0, Infinity, duration, fps);
        }
      }}
      onPointerMove={event => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          setStart(start + pixelsToFrames(event.movementX));
          setEnd(end + pixelsToFrames(event.movementX));
        }
      }}
      onPointerUp={event => {
        if (event.button === 0) {
          event.currentTarget.releasePointerCapture(event.pointerId);
          onDrop();
        }
      }}
    >
      <RangeHandle
        onDrag={event => setStart(start + pixelsToFrames(event.movementX))}
        onDrop={onDrop}
      />
      <div class={styles.handleSpacer} />
      <RangeHandle
        onDrag={event => setEnd(end + pixelsToFrames(event.movementX))}
        onDrop={onDrop}
      />
    </div>
  );
}

interface RangeHandleProps {
  onDrag: (event: PointerEvent) => void;
  onDrop: (event: PointerEvent) => void;
}

function RangeHandle({onDrag, onDrop}: RangeHandleProps) {
  return (
    <DragIndicator
      className={styles.handle}
      onPointerDown={event => {
        if (event.button === 0) {
          event.preventDefault();
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);
        }
      }}
      onPointerMove={event => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.stopPropagation();
          onDrag(event);
        }
      }}
      onPointerUp={event => {
        if (event.button === 0) {
          event.stopPropagation();
          event.currentTarget.releasePointerCapture(event.pointerId);
          onDrop(event);
        }
      }}
    />
  );
}
