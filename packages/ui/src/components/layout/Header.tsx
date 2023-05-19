import styles from './Header.module.scss';
import type {JSX} from 'preact';
import clsx from 'clsx';

export function Header({
  className,
  ...props
}: JSX.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx(styles.header, className)} {...props} />;
}
