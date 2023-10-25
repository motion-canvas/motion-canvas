import {JSX} from 'preact';
import {useApplication} from '../../contexts';
import {usePlayerState} from '../../hooks';
import {formatDuration} from '../../utils';
import styles from './Viewport.module.scss';

interface TimestampProps extends JSX.HTMLAttributes<HTMLInputElement> {
  frame: number;
  title: string;
  frameTitle: string;
  reverse?: boolean;
}

export function Timestamp({
  frame,
  reverse = false,
  title,
  frameTitle,
  ...rest
}: TimestampProps) {
  const {player} = useApplication();
  const {speed} = usePlayerState();

  let precision = 0;
  let padding = player.status.fps.toString().length;
  if (speed % 1 !== 0) {
    precision = 2;
    padding += 3;
  }

  const frames = (
    <span title={frameTitle} className={styles.frames}>
      [{frame.toFixed(precision)}]
    </span>
  );

  return (
    <code {...rest}>
      {reverse && frames}
      <span title={`${title} [HH:MM:SS:FF]`}>
        {formatDuration(player.status.framesToSeconds(frame))}:
        {(frame % player.status.fps).toFixed(precision).padStart(padding, '0')}
      </span>
      {!reverse && frames}
    </code>
  );
}
