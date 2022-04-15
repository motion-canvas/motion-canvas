import styles from './Tabs.module.scss';

import {Icon, IconType} from '../controls';
import {ComponentChildren} from 'preact';
import {useCallback} from 'preact/hooks';
import {classes} from '../../utils';
import {useStorage} from '../../hooks';

interface TabsProps {
  children: {icon: IconType; pane: ComponentChildren}[];
  onToggle?: (tab: number) => any;
  id?: string;
}

export function Tabs({children, onToggle, id}: TabsProps) {
  const [tab, setTab] = useStorage(id, 1);
  const toggleTab = useCallback(
    (value: number) => {
      const newTab = value === tab ? -1 : value;
      setTab(newTab);
      onToggle?.(newTab);
    },
    [tab, setTab, onToggle],
  );

  return (
    <div className={styles.root}>
      <div className={styles.panes}>{children[tab]?.pane}</div>
      <div className={styles.tabs}>
        {children.map(({icon, pane}, index) => (
          <Icon
            type={icon}
            onClick={() => toggleTab(index)}
            className={classes(styles.tab, [styles.active, tab === index])}
          />
        ))}
      </div>
    </div>
  );
}
