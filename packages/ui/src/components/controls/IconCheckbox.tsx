import styles from './Controls.module.scss';

import {IconType} from './IconType';
import clsx from 'clsx';

interface IconCheckboxProps {
  iconOn?: IconType;
  iconOff?: IconType;
  titleOn?: string;
  titleOff?: string;
  id: string;
  onChange?: (value: boolean) => void;
  checked?: boolean;
  main?: boolean;
}

export function IconCheckbox({
  iconOn,
  iconOff,
  titleOn,
  titleOff,
  id,
  onChange,
  checked = false,
  main = false,
}: IconCheckboxProps) {
  return (
    <div className={styles.iconCheckbox}>
      <input
        className={styles.iconInput}
        type="checkbox"
        id={id}
        checked={checked}
        onChange={event => {
          onChange?.((event.target as HTMLInputElement).checked);
        }}
      />
      <label
        title={titleOff && !checked ? titleOff : titleOn}
        className={clsx(
          styles.icon,
          styles.iconLabel,
          main && styles.main,
          (checked || !iconOff) && styles[iconOn],
          iconOff && !checked && styles[iconOff],
        )}
        htmlFor={id}
      />
    </div>
  );
}
