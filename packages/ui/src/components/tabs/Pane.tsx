import styles from './Tabs.module.scss';

import {ComponentChildren} from 'preact';

export interface PaneProps {
  title: string;
  children: ComponentChildren;
}

export function Pane({title, children}: PaneProps) {
  return (
    <div className={styles.pane}>
      <div className={styles.header}>{title}</div>
      {children}
    </div>
  );
}
