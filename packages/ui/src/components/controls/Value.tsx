import styles from './Controls.module.scss';
import type {JSX} from 'preact';
import {ColorPreview} from './ColorPreview';
import {classes} from '../../utils';

interface ValueProps extends JSX.HTMLAttributes<HTMLDivElement> {
  previewColor?: string;
  pointerCursor?: boolean;
}

export function Value({
  previewColor,
  pointerCursor,
  children,
  ...props
}: ValueProps) {
  const className = classes(styles.value, [
    styles.pointerCursor,
    pointerCursor,
  ]);

  return previewColor ? (
    <div className={styles.valueWrapper}>
      <ColorPreview color={previewColor} />
      <div className={className} {...props}>
        {children}
      </div>
    </div>
  ) : (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
