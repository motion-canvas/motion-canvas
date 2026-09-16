import clsx from 'clsx';
import type {JSX} from 'preact';
import styles from './Controls.module.scss';

type ReadOnlyInputProps = JSX.HTMLAttributes<HTMLDivElement>;

export function ReadOnlyInput({className, ...props}: ReadOnlyInputProps) {
  return <div className={clsx(className, styles.input)} {...props} />;
}
