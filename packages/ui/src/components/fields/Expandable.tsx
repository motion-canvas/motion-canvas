import {ComponentChildren} from 'preact';

import {useStorage} from '../../hooks';
import {Toggle} from '../controls';
import {Collapse} from '../layout';

import styles from './Expandable.module.scss';

export interface ExpandableProps {
  title: string;
  children: ComponentChildren;
  open?: boolean;
}

export function Expandable({title, children, open}: ExpandableProps) {
  const [isOpen, setOpen] = useStorage(`expandable-${title}`, open);

  return (
    <ControlledExpandable title={title} open={isOpen} setOpen={setOpen}>
      {children}
    </ControlledExpandable>
  );
}

export interface ControlledExpandableProps {
  title: string;
  children: ComponentChildren;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function ControlledExpandable({
  title,
  children,
  open,
  setOpen,
}: ControlledExpandableProps) {
  return (
    <div className={styles.root}>
      <div className={styles.title} onClick={() => setOpen(!open)}>
        <Toggle open={open} />
        {title}
      </div>
      <Collapse open={open}>
        <div className={styles.content}>{children}</div>
      </Collapse>
    </div>
  );
}
