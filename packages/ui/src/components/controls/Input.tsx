import styles from './Controls.module.scss';
import type {JSX} from 'preact';

type InputProps = JSX.HTMLAttributes<HTMLInputElement>;

export function Input({onChange, onChangeCapture, ...props}: InputProps) {
  return (
    <input
      onChangeCapture={onChangeCapture ?? onChange}
      onChange={onChangeCapture ? onChange : undefined}
      className={styles.input}
      {...props}
    />
  );
}
