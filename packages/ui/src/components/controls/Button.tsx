import styles from './Controls.module.scss';
import type {JSX} from 'preact';
import clsx from 'clsx';

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  main?: boolean;
}

export function Button(props: ButtonProps) {
  return (
    <button
      className={clsx(styles.button, props.main && styles.main)}
      type={'button'}
      {...props}
    />
  );
}
