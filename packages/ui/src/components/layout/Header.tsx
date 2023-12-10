import clsx from 'clsx';
import type {JSX} from 'preact';
import styles from './Header.module.scss';

export function Header({
  className,
  ...props
}: JSX.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx(styles.header, className)} {...props} />;
}
