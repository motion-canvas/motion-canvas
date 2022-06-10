import styles from './Controls.module.scss';
import type {JSX} from 'preact';

type InputProps = JSX.HTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  return <input className={styles.input} {...props} />;
}
