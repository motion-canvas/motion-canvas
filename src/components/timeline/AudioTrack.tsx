import styles from './Timeline.module.scss';

import {useContext, useLayoutEffect, useMemo, useRef} from 'preact/hooks';
import {TimelineContext} from './TimelineContext';
import {usePlayer, useSubscribableValue} from '../../hooks';

const HEIGHT = 48;

export function AudioTrack() {
  const ref = useRef<HTMLCanvasElement>();
  const {project, audio} = usePlayer();
  const context = useMemo(() => ref.current?.getContext('2d'), [ref.current]);
  const {viewLength, startFrame, endFrame, duration, density} =
    useContext(TimelineContext);

  const audioData = useSubscribableValue(audio.onDataChanged);

  useLayoutEffect(() => {
    if (!context) return;
    context.clearRect(0, 0, viewLength, HEIGHT * 2);
    if (!audioData) return;

    context.strokeStyle = 'white';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, HEIGHT);

    const start =
      audio.toRelativeTime(project.framesToSeconds(startFrame)) *
      audioData.sampleRate;
    const end =
      audio.toRelativeTime(project.framesToSeconds(endFrame)) *
      audioData.sampleRate;

    const flooredStart = ~~start;
    const padding = flooredStart - start;
    const length = end - start;
    const step = Math.ceil(density);
    for (let offset = 0; offset < length; offset += step * 2) {
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
  }, [context, audioData, density, viewLength, startFrame, endFrame]);

  const style = useMemo(
    () => ({
      marginLeft: `${(startFrame / duration) * 100}%`,
      width: `${((endFrame - startFrame) / duration) * 100}%`,
      height: `${HEIGHT * 2}px`,
    }),
    [startFrame, endFrame, duration],
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
