import clsx from 'clsx';
import {ChevronRight} from '../icons/ChevronRight';
import styles from './Controls.module.scss';

export interface ToggleProps {
  open?: boolean;
  onToggle?: (value: boolean) => void;
}

export function Toggle({open, onToggle}: ToggleProps) {
  return (
    <button
      className={clsx(styles.toggle, open && styles.open)}
      onClick={() => onToggle?.(!open)}
    >
      <ChevronRight />
    </button>
  );
}
