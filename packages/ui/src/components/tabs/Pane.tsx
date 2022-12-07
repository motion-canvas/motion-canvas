import styles from './Tabs.module.scss';

import {ComponentChildren} from 'preact';

export interface PaneProps {
  title: string;
  id?: string;
  children: ComponentChildren;
}

export function Pane({title, id, children}: PaneProps) {
  return (
    <div className={styles.pane} id={id}>
      <div className={styles.header}>{title}</div>
      {children}
    </div>
  );
}
