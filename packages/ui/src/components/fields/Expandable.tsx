import {ComponentChildren} from 'preact';

import {useStorage} from '../../hooks';
import {Toggle} from '../controls';

import styles from './Expandable.module.scss';

export interface ExpandableProps {
  title: string;
  children: ComponentChildren;
  open?: boolean;
}

export function Expandable({title, children, open}: ExpandableProps) {
  const [isOpen, setOpen] = useStorage(`expandable-${title}`, open);

  return (
    <div className={styles.root}>
      <div className={styles.title} onClick={() => setOpen(!isOpen)}>
        <Toggle open={isOpen} />
        {title}
      </div>
      {isOpen && <div className={styles.content}>{children}</div>}
    </div>
  );
}
