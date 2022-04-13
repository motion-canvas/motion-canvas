import styles from './Controls.module.scss';

import {Icon} from './Icon';

interface IconButtonProps {
  icon: Icon;
  onClick?: () => void;
}

export function IconButton({icon, onClick}: IconButtonProps) {
  return (
    <button
      className={styles.button + ' ' + styles[icon]}
      type="button"
      onClick={onClick}
    />
  );
}
