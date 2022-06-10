import styles from './Tabs.module.scss';

import {Icon, IconType} from '../controls';
import {ComponentChildren} from 'preact';
import {useCallback, useEffect} from 'preact/hooks';
import {classes} from '../../utils';
import {useStorage} from '../../hooks';

interface TabsProps {
  children: {icon: IconType; pane: ComponentChildren}[];
  onToggle?: (tab: number) => void;
  id?: string;
}

export function Tabs({children, onToggle, id}: TabsProps) {
  const [tab, setTab] = useStorage(id, 1);
  const toggleTab = useCallback(
    (value: number) => {
      const newTab = value === tab ? -1 : value;
      setTab(newTab);
    },
    [tab, setTab],
  );
  useEffect(() => {
    onToggle?.(tab);
  }, [onToggle, tab]);

  return (
    <div className={styles.root}>
      <div className={styles.panes}>{children[tab]?.pane}</div>
      <div className={styles.tabs}>
        {children.map(({icon}, index) => (
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
