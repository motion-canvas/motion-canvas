import styles from './Controls.module.scss';
import type {JSX} from 'preact';

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
