import styles from './Controls.module.scss';

import {IconType} from './IconType';
import {classes} from '../../utils';
import {JSX} from 'preact';

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
    <As className={classes(styles.icon, styles[type], className)} {...rest} />
  );
}
