import styles from './Controls.module.scss';
import {ComponentChildren} from 'preact';
import {classes} from '../../utils';

export interface PillProps {
  children: ComponentChildren;
  checked: boolean;
  onChange: (value: boolean) => void;
  titleOn?: string;
  titleOff?: string;
}

export function Pill({
  children,
  checked,
  onChange,
  titleOn,
  titleOff,
}: PillProps) {
  return (
    <div
      title={titleOff && !checked ? titleOff : titleOn}
      className={classes(styles.pill, [styles.checked, checked])}
      onClick={() => onChange(!checked)}
    >
      {children}
    </div>
  );
}
