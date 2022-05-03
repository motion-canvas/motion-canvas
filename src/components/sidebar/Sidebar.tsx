import styles from './Sidebar.module.scss';

import type {PlayerRenderEvent} from '@motion-canvas/core/player/Player';
import {IconType} from '../controls';
import {Tabs} from '../tabs/Tabs';
import {usePlayer, usePlayerState} from '../../hooks';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';
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
        pane: <Rendering />,
      }}
      {{
        icon: IconType.schedule,
        pane: <Threads />,
      }}
    </Tabs>
  );
}

function Rendering() {
  const player = usePlayer();
  const state = usePlayerState();
  const directoryHandle = useRef<FileSystemDirectoryHandle>();

  const handleRender = useCallback(async ({frame, blob}: PlayerRenderEvent) => {
    const name = frame.toString().padStart(6, '0');
    const size = blob.size / 1024;

    try {
      directoryHandle.current ??= await window.showDirectoryPicker();
      const file = await directoryHandle.current.getFileHandle(
        `frame-${name}.png`,
        {
          create: true,
        },
      );
      const stream = await file.createWritable();
      await stream.write(blob);
      await stream.close();
      console.log(`Frame: ${name}, Size: ${Math.round(size)} kB`);
    } catch (e) {
      console.error(e);
      player.toggleRendering(false);
    }
  }, []);

  useEffect(() => {
    player.RenderChanged.subscribe(handleRender);
    return () => player.RenderChanged.unsubscribe(handleRender);
  }, [handleRender]);

  return (
    <div className={styles.pane}>
      <div className={styles.header}>Rendering</div>
      <button onClick={() => player.toggleRendering()}>
        {state.render ? 'RENDERING...' : 'RENDER'}
      </button>
    </div>
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
