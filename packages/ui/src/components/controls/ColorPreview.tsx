import {JSX} from 'preact';

import styles from './Controls.module.scss';

interface ColorPreviewProps extends JSX.HTMLAttributes<HTMLDivElement> {
  color: string;
}

export function ColorPreview({color, ...props}: ColorPreviewProps) {
  return (
    <div className={styles.colorPreview} {...props}>
      <div style={{background: color}} />
    </div>
  );
}
