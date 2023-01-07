import styles from './Controls.module.scss';

import {IconType} from './IconType';
import clsx from 'clsx';

interface IconButtonProps {
  icon: IconType;
  title?: string;
  onClick?: () => void;
}

export function IconButton({icon, onClick, title}: IconButtonProps) {
  return (
    <button
      title={title}
      className={clsx(styles.iconButton, styles.icon, styles[icon])}
      type="button"
      onClick={onClick}
    />
  );
}
