import {ComponentChildren, JSX} from 'preact';
import {Header} from '../layout';
import styles from './Tabs.module.scss';

export interface PaneProps extends JSX.HTMLAttributes<HTMLDivElement> {
  title: string;
  id?: string;
  children: ComponentChildren;
}

export function Pane({title, id, children, ...props}: PaneProps) {
  return (
    <div className={styles.pane} id={id} {...props}>
      <Header>{title}</Header>
      {children}
    </div>
  );
}
