import type {JSX} from 'preact';
import styles from './Controls.module.scss';
import {Input} from './Input';
import {Select, SelectProps} from './Select';

export type InputSelectProps<T> = Omit<
  JSX.HTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> &
  SelectProps<T>;

export function InputSelect<T extends string | number>({
  options,
  value,
  onChange,
  ...props
}: InputSelectProps<T>) {
  return (
    <div className={styles.inputSelect}>
      <Input
        value={value}
        onChange={event => {
          onChange((event.target as HTMLInputElement).value as T);
        }}
        {...props}
      />
      <Select value={value} options={options} onChange={onChange} />
    </div>
  );
}
