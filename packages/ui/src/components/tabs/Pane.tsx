import {ComponentChildren, JSX} from 'preact';
import {Ref} from 'preact/hooks';
import {Header} from '../layout';
import styles from './Tabs.module.scss';

export interface PaneProps extends JSX.HTMLAttributes<HTMLDivElement> {
  forwardRef?: Ref<HTMLDivElement>;
  title: string;
  id?: string;
  children: ComponentChildren;
}

export function Pane({title, id, children, forwardRef, ...props}: PaneProps) {
  return (
    <div ref={forwardRef} className={styles.pane} id={id} {...props}>
      <Header>{title}</Header>
      {children}
    </div>
  );
}
