import styles from './Controls.module.scss';
import type {JSX} from 'preact';
import clsx from 'clsx';

export interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  main?: boolean;
}

export function Button({main, className, ...props}: ButtonProps) {
  return (
    <button
      className={clsx(styles.button, className, main && styles.main)}
      onMouseUp={event => (event.target as HTMLButtonElement).blur()}
      type={'button'}
      {...props}
    />
  );
}
