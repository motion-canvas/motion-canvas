import styles from './Controls.module.scss';

import clsx from 'clsx';
import {ComponentChildren} from 'preact';
import {IconButton} from './IconButton';

interface IconCheckboxProps {
  children: ComponentChildren;
  titleOn?: string;
  titleOff?: string;
  onChange?: (value: boolean) => void;
  checked?: boolean;
  main?: boolean;
}

export function IconCheckbox({
  children,
  titleOn,
  titleOff,
  onChange,
  checked = false,
  main = false,
}: IconCheckboxProps) {
  return (
    <IconButton
      className={clsx(
        styles.iconCheckbox,
        main && styles.main,
        checked && styles.checked,
      )}
      title={titleOff && !checked ? titleOff : titleOn}
      onClick={() => onChange?.(!checked)}
    >
      {children}
    </IconButton>
  );
}
