import styles from './Controls.module.scss';
import clsx from 'clsx';
import {ChevronRight} from '../icons/ChevronRight';

export interface ToggleProps {
  open?: boolean;
  onToggle: (value: boolean) => void;
}

export function Toggle({open, onToggle}: ToggleProps) {
  return (
    <button
      className={clsx(styles.toggle, open && styles.open)}
      onClick={() => onToggle(!open)}
    >
      <ChevronRight />
    </button>
  );
}
