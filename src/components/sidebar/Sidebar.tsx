import {useCallback, useEffect, useMemo, useState} from 'preact/hooks';

import {GeneratorHelper} from '@motion-canvas/core/lib/helpers';
import type {Thread} from '@motion-canvas/core/lib/threading';

import {useSubscribable, usePlayer, usePlayerState} from '../../hooks';
import {Button, Group, IconType, Input, Label, Select} from '../controls';
import {Tabs} from '../tabs/Tabs';
import {Properties} from './Properties';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  setOpen?: (value: boolean) => void;
}

export function Sidebar({setOpen}: SidebarProps) {
  return (
    <Tabs onToggle={tab => setOpen(tab >= 0)} id="sidebar">
      {{
        icon: IconType.tune,
        pane: <Properties />,
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
  const {width, height} = player.project.getSize();

  const resolutions = useMemo(() => {
    return [
      {value: 0.5, text: `${width / 2}x${height / 2} (Half)`},
      {value: 1, text: `${width}x${height} (Full)`},
      {value: 2, text: `${width * 2}x${height * 2} (Double)`},
    ];
  }, [width, height]);

  useSubscribable(
    player.onFrameRendered,
    async ({frame, data}) => {
      try {
        const name = frame.toString().padStart(6, '0');
        await fetch(`/render/frame${name}.png`, {
          method: 'POST',
          body: data,
        });
      } catch (e) {
        console.error(e);
        player.toggleRendering(false);
      }
    },
    [],
  );

  return (
    <div className={styles.pane}>
      <div className={styles.header}>Rendering</div>
      <Group>
        <Label>Range</Label>
        <Input
          min={0}
          max={state.endFrame}
          type={'number'}
          value={state.startFrame}
          onChange={event => {
            player.setRange(parseInt((event.target as HTMLInputElement).value));
          }}
        />
        <Input
          min={state.startFrame}
          max={state.duration}
          type={'number'}
          value={Math.min(state.duration, state.endFrame)}
          onChange={event => {
            const value = parseInt((event.target as HTMLInputElement).value);
            player.setRange(undefined, value);
          }}
        />
      </Group>
      <Group>
        <Label>FPS</Label>
        <Select
          options={[
            {value: 30, text: '30 FPS'},
            {value: 60, text: '60 FPS'},
          ]}
          value={state.fps}
          onChange={value => player.setFramerate(value)}
        />
      </Group>
      <Group>
        <Label>Resolution</Label>
        <Select
          options={resolutions}
          value={state.scale}
          onChange={value => player.setScale(value)}
        />
      </Group>
      <Group>
        <Label />
        <Button main onClick={() => player.toggleRendering()}>
          {state.render ? 'STOP RENDERING' : 'RENDER'}
        </Button>
      </Group>
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
