import styles from './Controls.module.scss';

import {classes} from '../../utils';
import {IconType} from './IconType';

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
        className={classes(
          styles.icon,
          styles.iconLabel,
          [styles.main, main],
          [styles[iconOn], checked || !iconOff],
          [styles[iconOff], iconOff && !checked],
        )}
        htmlFor={id}
      />
    </div>
  );
}
