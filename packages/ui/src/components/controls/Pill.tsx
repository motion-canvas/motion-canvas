import clsx from 'clsx';
import {ComponentChildren} from 'preact';
import styles from './Controls.module.scss';

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
      className={clsx(styles.pill, checked && styles.checked)}
      onClick={() => onChange(!checked)}
    >
      {children}
    </div>
  );
}
