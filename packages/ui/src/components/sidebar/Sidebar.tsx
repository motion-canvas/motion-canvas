import {IconType} from '../controls';
import {Tabs, TabType} from '../tabs';
import {Properties} from './Properties';
import {Rendering} from './Rendering';
import {Threads} from './Threads';

interface SidebarProps {
  setOpen?: (value: boolean) => void;
}

export function Sidebar({setOpen}: SidebarProps) {
  return (
    <>
      <Tabs onToggle={tab => setOpen(tab >= 0)} id="sidebar">
        {{
          type: TabType.Link,
          icon: IconType.motionCanvas,
          url: window.location.pathname === '/' ? undefined : '/',
        }}
        {{
          type: TabType.Space,
        }}
        {{
          type: TabType.Pane,
          icon: IconType.tune,
          pane: <Properties />,
        }}
        {{
          type: TabType.Pane,
          icon: IconType.videoSettings,
          pane: <Rendering />,
        }}
        {{
          type: TabType.Pane,
          icon: IconType.schedule,
          pane: <Threads />,
        }}
        {{
          type: TabType.Space,
        }}
      </Tabs>
    </>
  );
}
