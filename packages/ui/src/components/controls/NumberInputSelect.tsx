import type {JSX} from 'preact';
import styles from './Controls.module.scss';
import {NumberInput} from './NumberInput';
import {Select, SelectProps} from './Select';

export type NumberInputSelectProps = Omit<
  JSX.HTMLAttributes<HTMLInputElement>,
  'min' | 'max' | 'step' | 'value' | 'onChange' | 'onChangeCapture'
> &
  SelectProps<number> & {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChangeCapture?: (value: number) => void;
  };

export function NumberInputSelect({
  options,
  value,
  onChange,
  ...props
}: NumberInputSelectProps) {
  return (
    <div className={styles.inputSelect}>
      <NumberInput
        value={value}
        onChange={value => onChange(value)}
        {...props}
      />
      <Select value={value} options={options} onChange={onChange} />
    </div>
  );
}
