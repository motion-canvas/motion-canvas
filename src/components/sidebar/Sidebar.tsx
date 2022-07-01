import {IconType} from '../controls';
import {Tabs} from '../tabs';
import {Properties} from './Properties';
import {Rendering} from './Rendering';
import {Threads} from './Threads';

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
