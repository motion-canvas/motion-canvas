import styles from './Controls.module.scss';

import clsx from 'clsx';
import {ComponentChildren} from 'preact';

interface IconButtonProps {
  title?: string;
  onClick?: () => void;
  children: ComponentChildren;
  className?: string;
}

export function IconButton({
  children,
  onClick,
  title,
  className,
}: IconButtonProps) {
  return (
    <button
      title={title}
      className={clsx(styles.iconButton, className)}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
