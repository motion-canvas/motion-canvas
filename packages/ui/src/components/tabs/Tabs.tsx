import styles from './Tabs.module.scss';

import {Icon, IconType} from '../controls';
import {ComponentChildren} from 'preact';
import {useCallback, useLayoutEffect} from 'preact/hooks';
import clsx from 'clsx';

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
      badge?: ComponentChildren;
      title?: string;
      id?: string;
    }
  | {
      type: TabType.Link;
      icon: IconType;
      url?: string;
      title?: string;
      id?: string;
    }
  | {
      type: TabType.Space;
    };

export interface TabsProps {
  children: Tab[];
  tab: number;
  onToggle: (tab: number) => void;
}

export function Tabs({children, tab, onToggle}: TabsProps) {
  const toggleTab = useCallback(
    (value: number) => {
      const newTab = value === tab ? -1 : getPane(children[value]) ? value : -1;
      onToggle(newTab);
    },
    [tab, onToggle, children],
  );
  useLayoutEffect(() => {
    if (tab > -1 && !getPane(children[tab])) {
      onToggle(-1);
    } else {
      onToggle(tab);
    }
  }, [onToggle, tab]);

  return (
    <div className={styles.root}>
      <div className={styles.panes}>{getPane(children[tab])}</div>
      <div className={styles.tabs}>
        {children.map((data, index) =>
          data.type === TabType.Link ? (
            <Icon
              as="a"
              title={data.title}
              type={data.icon}
              href={data.url}
              id={data.id}
              className={clsx(styles.tab, !data.url && styles.disabled)}
            />
          ) : data.type === TabType.Pane ? (
            <Icon
              type={data.icon}
              title={data.title}
              id={data.id}
              onClick={() => toggleTab(index)}
              className={clsx(styles.tab, tab === index && styles.active)}
            >
              {data.badge}
            </Icon>
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
