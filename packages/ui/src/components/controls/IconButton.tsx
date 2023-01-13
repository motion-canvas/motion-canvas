import styles from './Controls.module.scss';

import clsx from 'clsx';
import {ComponentChildren} from 'preact';

interface IconButtonProps {
  title?: string;
  onClick?: () => void;
  children: ComponentChildren;
}

export function IconButton({children, onClick, title}: IconButtonProps) {
  return (
    <button
      title={title}
      className={clsx(styles.iconButton)}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
