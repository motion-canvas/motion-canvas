import type {JSX} from 'preact';

import styles from './Controls.module.scss';
import clsx from 'clsx';

export function Separator({
  className,
  ...props
}: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx(styles.separator, className)} {...props}>
      {props.children}
    </div>
  );
}
