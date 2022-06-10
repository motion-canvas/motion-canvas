import styles from './Controls.module.scss';
import type {JSX} from 'preact';

type LabelProps = JSX.HTMLAttributes<HTMLLabelElement>;

export function Label(props: LabelProps) {
  return <label className={styles.label} {...props} />;
}
