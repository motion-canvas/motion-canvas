import styles from './Controls.module.scss';

import {IconType} from './IconType';
import {classes} from '../../utils';

interface IconButtonProps {
  icon: IconType;
  onClick?: () => void;
}

export function IconButton({icon, onClick}: IconButtonProps) {
  return (
    <button
      className={classes(styles.iconButton, styles.icon, styles[icon])}
      type="button"
      onClick={onClick}
    />
  );
}
