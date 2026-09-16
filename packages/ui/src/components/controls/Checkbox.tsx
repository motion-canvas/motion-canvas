import type {InputHTMLAttributes} from 'preact';
import styles from './Controls.module.scss';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Checkbox(props: InputProps) {
  return <input type="checkbox" className={styles.checkbox} {...props} />;
}
