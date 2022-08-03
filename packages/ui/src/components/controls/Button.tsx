import styles from './Controls.module.scss';
import type {JSX} from 'preact';
import {classes} from '../../utils';

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  main?: boolean;
}

export function Button(props: ButtonProps) {
  return (
    <button
      className={classes(styles.button, [styles.main, props.main])}
      type={'button'}
      {...props}
    />
  );
}
