import styles from './Controls.module.scss';

import clsx from 'clsx';
import {ComponentChildren} from 'preact';

interface IconCheckboxProps {
  children: ComponentChildren;
  titleOn?: string;
  titleOff?: string;
  id: string;
  onChange?: (value: boolean) => void;
  checked?: boolean;
  main?: boolean;
}

export function IconCheckbox({
  children,
  titleOn,
  titleOff,
  id,
  onChange,
  checked = false,
  main = false,
}: IconCheckboxProps) {
  return (
    <div className={styles.iconCheckbox}>
      <label
        title={titleOff && !checked ? titleOff : titleOn}
        className={clsx(styles.iconLabel, main && styles.main)}
        htmlFor={id}
      >
        <input
          className={styles.iconInput}
          type="checkbox"
          id={id}
          checked={checked}
          onChange={event => {
            onChange?.((event.target as HTMLInputElement).checked);
          }}
        />
        {children}
      </label>
    </div>
  );
}
