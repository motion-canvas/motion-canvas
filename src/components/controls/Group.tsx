import styles from './Controls.module.scss';
import type {JSX} from 'preact';

type GroupProps = JSX.HTMLAttributes<HTMLDivElement>;

export function Group(props: GroupProps) {
  return (
    <div className={styles.group} {...props}>
      {props.children}
    </div>
  );
}
