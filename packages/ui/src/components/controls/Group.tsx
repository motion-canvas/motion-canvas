import type {JSX} from 'preact';

import styles from './Controls.module.scss';

export function Group(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={styles.group} {...props}>
      {props.children}
    </div>
  );
}
