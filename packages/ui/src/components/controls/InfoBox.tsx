import clsx from 'clsx';
import styles from './Controls.module.scss';
import {ReactNode} from 'react';

export interface InfoBoxProps {
  children: ReactNode;
}

export function InfoBox({children}: InfoBoxProps) {
  return <div className={clsx(styles.infoBox)}>{children}</div>;
}
