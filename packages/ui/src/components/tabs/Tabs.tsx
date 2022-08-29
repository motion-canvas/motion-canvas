import styles from './Tabs.module.scss';

import {Icon, IconType} from '../controls';
import {ComponentChildren} from 'preact';
import {useCallback, useEffect, useLayoutEffect} from 'preact/hooks';
import {classes} from '../../utils';
import {useStorage} from '../../hooks';
import {useInspection} from '../../contexts';

export enum TabType {
  Link,
  Pane,
  Space,
}

type Tab =
  | {
      type: TabType.Pane;
      icon: IconType;
      pane: ComponentChildren;
    }
  | {
      type: TabType.Link;
      icon: IconType;
      url?: string;
    }
  | {
      type: TabType.Space;
    };

interface TabsProps {
  children: Tab[];
  onToggle?: (tab: number) => void;
  id?: string;
}

export function Tabs({children, onToggle, id}: TabsProps) {
  const [tab, setTab] = useStorage(id, -1);
  const toggleTab = useCallback(
    (value: number) => {
      const newTab = value === tab ? -1 : getPane(children[value]) ? value : -1;
      setTab(newTab);
    },
    [tab, setTab, children],
  );
  useLayoutEffect(() => {
    if (tab > -1 && !getPane(children[tab])) {
      setTab(-1);
    } else {
      onToggle?.(tab);
    }
  }, [onToggle, tab]);

  const {inspectedElement} = useInspection();
  useEffect(() => {
    if (inspectedElement && tab !== -1) {
      setTab(2);
    }
  }, [inspectedElement]);

  return (
    <div className={styles.root}>
      <div className={styles.panes}>{getPane(children[tab])}</div>
      <div className={styles.tabs}>
        {children.map((data, index) =>
          data.type === TabType.Link ? (
            <Icon
              as="a"
              type={data.icon}
              href={data.url}
              className={classes(styles.tab, [styles.disabled, !data.url])}
            />
          ) : data.type === TabType.Pane ? (
            <Icon
              type={data.icon}
              onClick={() => toggleTab(index)}
              className={classes(styles.tab, [styles.active, tab === index])}
            />
          ) : (
            <div className={styles.space} />
          ),
        )}
      </div>
    </div>
  );
}

function getPane(tab: Tab) {
  return tab && tab.type === TabType.Pane ? tab.pane : false;
}
