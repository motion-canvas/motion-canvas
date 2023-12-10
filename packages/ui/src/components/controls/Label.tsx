import type {JSX} from 'preact';
import styles from './Controls.module.scss';

type LabelProps = JSX.HTMLAttributes<HTMLLabelElement>;

export function Label(props: LabelProps) {
  return (
    <label
      title={props.children as string}
      className={styles.label}
      {...props}
    />
  );
}
