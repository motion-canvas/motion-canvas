import styles from './Controls.module.scss';
import {classes} from '../../utils';

export interface ToggleProps {
  open?: boolean;
  onToggle: (value: boolean) => void;
}

export function Toggle({open, onToggle}: ToggleProps) {
  return (
    <div
      className={classes(styles.toggle, [styles.open, open])}
      onClick={() => onToggle(!open)}
    />
  );
}
