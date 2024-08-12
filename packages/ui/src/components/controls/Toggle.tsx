import clsx from 'clsx';
import {JSX} from 'preact';
import {ChevronRight} from '../icons/ChevronRight';
import styles from './Controls.module.scss';

export interface ToggleProps
  extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'onToggle'> {
  open?: boolean;
  onToggle?: (value: boolean) => void;
  animated?: boolean;
}

export function Toggle({
  open,
  onToggle,
  animated = true,
  ...props
}: ToggleProps) {
  return (
    <button
      className={clsx(
        styles.toggle,
        open && styles.open,
        animated && styles.animated,
      )}
      onClick={() => onToggle?.(!open)}
      {...props}
    >
      <ChevronRight />
    </button>
  );
}
