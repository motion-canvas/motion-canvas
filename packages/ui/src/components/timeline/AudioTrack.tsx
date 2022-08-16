import styles from './Timeline.module.scss';

import {useLayoutEffect, useMemo, useRef} from 'preact/hooks';
import {useSubscribableValue} from '../../hooks';
import {useProject, useTimelineContext} from '../../contexts';

const HEIGHT = 48;

export function AudioTrack() {
  const ref = useRef<HTMLCanvasElement>();
  const project = useProject();
  const context = useMemo(() => ref.current?.getContext('2d'), [ref.current]);
  const {
    viewLength,
    firstVisibleFrame,
    lastVisibleFrame,
    density,
    framesToPercents,
  } = useTimelineContext();

  const audioData = useSubscribableValue(project.audio.onDataChanged);

  useLayoutEffect(() => {
    if (!context) return;
    context.clearRect(0, 0, viewLength, HEIGHT * 2);
    if (!audioData) return;

    context.strokeStyle = '#444';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, HEIGHT);

    const start =
      (project.framesToSeconds(firstVisibleFrame) -
        project.audio.onOffsetChanged.current) *
      audioData.sampleRate;
    const end =
      project.audio.toRelativeTime(project.framesToSeconds(lastVisibleFrame)) *
      audioData.sampleRate;

    const flooredStart = Math.floor(start);
    const padding = flooredStart - start;
    const length = end - start;
    const step = Math.ceil(density);
    for (let index = start; index < end; index += step * 2) {
      const offset = index - start;
      const sample = flooredStart + offset;
      if (sample >= audioData.peaks.length) break;

      context.lineTo(
        ((padding + offset) / length) * viewLength,
        (audioData.peaks[sample] / audioData.absoluteMax) * HEIGHT + HEIGHT,
      );
      context.lineTo(
        ((padding + offset + step) / length) * viewLength,
        (audioData.peaks[sample + 1] / audioData.absoluteMax) * HEIGHT + HEIGHT,
      );
    }

    context.stroke();
  }, [
    context,
    audioData,
    density,
    viewLength,
    firstVisibleFrame,
    lastVisibleFrame,
  ]);

  const style = useMemo(
    () => ({
      marginLeft: `${framesToPercents(firstVisibleFrame)}%`,
      width: `${framesToPercents(lastVisibleFrame - firstVisibleFrame)}%`,
      height: `${HEIGHT * 2}px`,
    }),
    [firstVisibleFrame, lastVisibleFrame, framesToPercents],
  );

  return (
    <canvas
      style={style}
      width={viewLength}
      height={HEIGHT * 2}
      ref={ref}
      className={styles.audioTrack}
    />
  );
}
