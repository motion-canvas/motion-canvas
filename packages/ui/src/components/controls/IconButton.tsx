import styles from './Controls.module.scss';

import clsx from 'clsx';
import {ComponentChildren} from 'preact';

interface IconButtonProps {
  title?: string;
  onClick?: () => void;
  children: ComponentChildren;
  disabled?: boolean;
  className?: string;
}

export function IconButton({
  children,
  onClick,
  title,
  className,
  disabled,
}: IconButtonProps) {
  return (
    <button
      title={title}
      className={clsx(
        styles.iconButton,
        className,
        disabled && styles.disabled,
      )}
      type="button"
      onClick={disabled ? null : onClick}
    >
      {children}
    </button>
  );
}
