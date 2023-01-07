import styles from './Controls.module.scss';

import {IconType} from './IconType';
import {JSX} from 'preact';
import clsx from 'clsx';

type IntrinsicTag = keyof JSX.IntrinsicElements;

type IconProps<T extends IntrinsicTag> = JSX.IntrinsicElements[T] & {
  type: IconType;
  className?: string;
  as?: T;
};

export function Icon<T extends IntrinsicTag = 'div'>({
  type,
  className,
  as = 'div' as T,
  ...rest
}: IconProps<T>) {
  const As = as as string;
  return (
    <As className={clsx(styles.icon, styles[type], className)} {...rest} />
  );
}
