import styles from './Controls.module.scss';
import type {JSX} from 'preact';
import clsx from 'clsx';

export interface ButtonProps
  extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'loading'> {
  main?: boolean;
  loading?: boolean;
}

export function Button({main, loading, className, ...props}: ButtonProps) {
  return (
    <button
      className={clsx(
        styles.button,
        className,
        main && styles.main,
        loading && 'loading',
      )}
      onMouseUp={event => (event.target as HTMLButtonElement).blur()}
      type={'button'}
      {...props}
    />
  );
}
