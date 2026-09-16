import clsx from 'clsx';
import type {ButtonHTMLAttributes} from 'preact';
import styles from './Controls.module.scss';

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'loading'
> {
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
