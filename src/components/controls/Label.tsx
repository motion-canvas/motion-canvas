import styles from './Controls.module.scss';
import type {JSX} from 'preact';

interface LabelProps extends JSX.HTMLAttributes<HTMLLabelElement> {}

export function Label(props: LabelProps) {
  return <label className={styles.label} {...props} />;
}
