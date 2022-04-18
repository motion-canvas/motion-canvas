import styles from './Sidebar.module.scss';

import {IconType} from '../controls';
import {Tabs} from '../tabs/Tabs';
import {usePlayer} from '../../hooks';
import {useCallback, useEffect, useState} from 'preact/hooks';
import {Thread} from '@motion-canvas/core/threading';
import {GeneratorHelper} from '@motion-canvas/core/helpers';

interface SidebarProps {
  setOpen?: (value: boolean) => any;
}

export function Sidebar({setOpen}: SidebarProps) {
  return (
    <Tabs onToggle={tab => setOpen(tab >= 0)} id="sidebar">
      {{
        icon: IconType.tune,
        pane: <div className={styles.pane}>Settings</div>,
      }}
      {{
        icon: IconType.videoSettings,
        pane: <div className={styles.pane}>Rendering</div>,
      }}
      {{
        icon: IconType.schedule,
        pane: <Threads />,
      }}
    </Tabs>
  );
}

function useForceRender() {
  const [value, setValue] = useState(0);
  return useCallback(() => setValue(value + 1), [value]);
}

function Threads() {
  const render = useForceRender();
  const player = usePlayer();
  const [thread, setThread] = useState<Thread>(player.project.thread);
  const handleThreads = useCallback(() => {
    player.project.threadsCallback = setThread;
    render();
  }, [render, setThread]);

  useEffect(() => {
    player.project.threadsCallback = handleThreads;
  }, [player, handleThreads]);

  return (
    <div className={styles.pane}>
      <div className={styles.header}>Threads</div>
      {thread && <ThreadView thread={thread} />}
    </div>
  );
}

interface ThreadViewProps {
  thread: Thread;
}

function ThreadView({thread}: ThreadViewProps) {
  return (
    <div>
      {GeneratorHelper.getName(thread.runner)}
      {thread.children.length > 0 && (
        <ul>
          {thread.children.map(value => (
            <ThreadView thread={value} />
          ))}
        </ul>
      )}
    </div>
  );
}
