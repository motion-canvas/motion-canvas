import styles from './Controls.module.scss';

import {classes} from '../../utils';
import {Icon} from './Icon';

interface IconCheckboxProps {
  iconOn?: Icon;
  iconOff?: Icon;
  id: string;
  onChange?: (value: boolean) => void;
  checked?: boolean;
  main?: boolean;
}

export function IconCheckbox({
  iconOn,
  iconOff,
  id,
  onChange,
  checked = false,
  main = false,
}: IconCheckboxProps) {
  return (
    <div className={styles.icon}>
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
        className={classes(
          styles.iconLabel,
          [styles.main, main],
          [styles[iconOn], checked],
          [styles[iconOff], !checked],
        )}
        htmlFor={id}
      ></label>
    </div>
  );
}
