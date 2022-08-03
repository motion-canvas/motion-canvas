import styles from './Controls.module.scss';

interface SelectProps<T> {
  options: {value: T; text: string}[];
  value: T;
  onChange: (value: T) => void;
}

export function Select<T>({options, value, onChange}: SelectProps<T>) {
  return (
    <select
      className={styles.select}
      value={options.findIndex(option => option.value === value)}
      onChange={event =>
        onChange(
          options[parseInt((event.target as HTMLSelectElement).value)].value,
        )
      }
    >
      {options.map((option, index) => (
        <option key={option.value} value={index}>
          {option.text}
        </option>
      ))}
    </select>
  );
}
