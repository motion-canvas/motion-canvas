import styles from './Timeline.module.scss';

import {useContext, useLayoutEffect, useMemo, useRef} from 'preact/hooks';
import {TimelineContext} from './TimelineContext';
import {usePlayer} from '../../hooks';

const HEIGHT = 48;

export function AudioTrack() {
  const ref = useRef<HTMLCanvasElement>();
  const player = usePlayer();
  const context = useMemo(() => ref.current?.getContext('2d'), [ref.current]);
  const {viewLength, startFrame, endFrame, duration, density} =
    useContext(TimelineContext);

  useLayoutEffect(() => {
    if (!context) return;

    const audio = player.audio.meta;
    const samplesPerSeconds = audio.sample_rate / audio.samples_per_pixel;
    const step = Math.ceil(density / 256);
    const start = Math.floor(
      (player.project.framesToSeconds(startFrame) + player.audio.offset) *
        samplesPerSeconds,
    );
    const end = Math.floor(
      (player.project.framesToSeconds(endFrame) + player.audio.offset) *
        samplesPerSeconds,
    );

    context.clearRect(0, 0, viewLength, 64);
    context.strokeStyle = 'white';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, HEIGHT);

    const length = end - start;
    for (let offset = 0; offset < length; offset += step) {
      const sample = (start + offset) * 2;
      if (sample >= audio.data.length) break;

      context.lineTo(
        (offset / length) * viewLength,
        (audio.data[sample] / 32767) * HEIGHT + HEIGHT,
      );
      context.lineTo(
        ((offset + 0.5) / length) * viewLength,
        (audio.data[sample + 1] / 32767) * HEIGHT + HEIGHT,
      );
    }

    context.stroke();
  }, [context, density, viewLength, startFrame, endFrame]);

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
      height={64}
      ref={ref}
      className={styles.audioTrack}
    />
  );
}
