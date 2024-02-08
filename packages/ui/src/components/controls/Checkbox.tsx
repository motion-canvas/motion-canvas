import styles from './Controls.module.scss';
import type {JSX} from 'preact';

type InputProps = JSX.HTMLAttributes<HTMLInputElement>;

export function Checkbox(props: InputProps) {
  return <input type="checkbox" className={styles.checkbox} {...props} />;
}
