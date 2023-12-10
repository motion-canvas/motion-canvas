import type {JSX} from 'preact';
import styles from './Controls.module.scss';

type InputProps = JSX.HTMLAttributes<HTMLInputElement>;

export function Checkbox(props: InputProps) {
  return <input type="checkbox" className={styles.checkbox} {...props} />;
}
