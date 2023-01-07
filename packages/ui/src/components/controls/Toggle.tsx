import styles from './Controls.module.scss';
import clsx from 'clsx';

export interface ToggleProps {
  open?: boolean;
  onToggle: (value: boolean) => void;
}

export function Toggle({open, onToggle}: ToggleProps) {
  return (
    <div
      className={clsx(styles.toggle, open && styles.open)}
      onClick={() => onToggle(!open)}
    />
  );
}
