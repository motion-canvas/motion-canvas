import {ComponentChildren} from 'preact';

import styles from './Header.module.scss';

export interface HeaderProps {
  children: ComponentChildren;
}

export function Header({children}: HeaderProps) {
  return <div className={styles.header}>{children}</div>;
}
