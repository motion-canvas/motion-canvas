import clsx from 'clsx';
import {Button, ButtonProps} from './Button';
import styles from './Controls.module.scss';

export interface ButtonCheckboxProps extends ButtonProps {
  checked?: boolean;
  onChecked?: (checked: boolean) => void;
}

export function ButtonCheckbox({
  checked,
  onChecked,
  ...props
}: ButtonCheckboxProps) {
  return (
    <Button
      onClick={() => {
        onChecked?.(!checked);
      }}
      className={clsx(checked && styles.checked)}
      type={'button'}
      {...props}
    />
  );
}
