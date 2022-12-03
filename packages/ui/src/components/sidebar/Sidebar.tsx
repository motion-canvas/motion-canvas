import {IconType} from '../controls';
import {Badge, Tabs, TabType} from '../tabs';
import {Properties} from './Properties';
import {Rendering} from './Rendering';
import {Threads} from './Threads';
import {Console} from '../console';
import {useInspection, useLogger} from '../../contexts';
import {useEffect, useRef, useState} from 'preact/hooks';
import {shake} from '../animations';
import {useStorage} from '../../hooks';

interface SidebarProps {
  setOpen?: (value: boolean) => void;
}

export function Sidebar({setOpen}: SidebarProps) {
  const [tab, setTab] = useStorage('sidebar', -1);
  const {inspectedElement} = useInspection();
  const logger = useLogger();
  const badge = useRef<HTMLDivElement>();
  const [errorCount, setErrorCount] = useState(logger.onErrorLogged.current);
  useEffect(
    () =>
      logger.onErrorLogged.subscribe(value => {
        setErrorCount(value);
        setTimeout(() => {
          badge.current?.animate(shake(2), {duration: 300});
        }, 0);
      }),
    [logger],
  );

  useEffect(() => {
    if (inspectedElement && tab !== -1) {
      setTab(2);
    }
  }, [inspectedElement]);

  return (
    <>
      <Tabs
        tab={tab}
        onToggle={tab => {
          setTab(tab);
          setOpen(tab >= 0);
        }}
      >
        {{
          title: 'Project Selection',
          type: TabType.Link,
          icon: IconType.motionCanvas,
          url: window.location.pathname === '/' ? undefined : '/',
        }}
        {{
          type: TabType.Space,
        }}
        {{
          title: 'Inspector',
          type: TabType.Pane,
          icon: IconType.tune,
          pane: <Properties />,
        }}
        {{
          title: 'Video Settings',
          type: TabType.Pane,
          icon: IconType.videoSettings,
          pane: <Rendering />,
        }}
        {{
          title: 'Thread Debugger',
          type: TabType.Pane,
          icon: IconType.schedule,
          pane: <Threads />,
        }}
        {{
          title: errorCount > 0 ? `Console (${errorCount})` : 'Console',
          type: TabType.Pane,
          icon: IconType.bug,
          pane: <Console />,
          badge: errorCount > 0 && (
            <Badge badgeRef={badge}>
              {errorCount > 999 ? `999+` : errorCount}
            </Badge>
          ),
        }}
        {{
          type: TabType.Space,
        }}
      </Tabs>
    </>
  );
}
