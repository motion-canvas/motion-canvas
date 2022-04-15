import styles from './Controls.module.scss';

import {IconType} from './IconType';
import {classes} from '../../utils';
import {JSX} from 'preact';

interface IconProps extends JSX.HTMLAttributes<HTMLDivElement> {
  type: IconType;
  className?: string;
}

export function Icon({type, className, ...rest}: IconProps) {
  return (
    <div className={classes(styles.icon, styles[type], className)} {...rest} />
  );
}
