import {Button, ButtonProps} from './Button';
import styles from './Controls.module.scss';
import {Select, SelectProps} from './Select';

export type ButtonSelectProps<T> = Omit<ButtonProps, 'value' | 'onChange'> &
  SelectProps<T>;

export function ButtonSelect<T extends string | number>({
  options,
  value,
  onChange,
  main,
  disabled,
  ...props
}: ButtonSelectProps<T>) {
  return (
    <div className={styles.inputSelect}>
      <Button main={main} {...props} disabled={disabled}>
        {options.find(option => option.value === value)?.text}
      </Button>
      <Select
        value={value}
        main={main}
        options={options}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
