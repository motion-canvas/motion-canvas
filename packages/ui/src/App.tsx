import './index.scss';

import {Sidebar} from './components/sidebar';
import {Timeline} from './components/timeline';
import {Viewport} from './components/viewport';
import {ResizeableLayout} from './components/layout';
import {useState, useMemo} from 'preact/hooks';
import {AppContext} from './AppContext';
import type {InspectedElement} from '@motion-canvas/core/lib/scenes';

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inspectedElement, setInspectedElement] =
    useState<InspectedElement | null>(null);

  const contextState = useMemo(
    () => ({
      inspectedElement,
      setInspectedElement,
    }),
    [inspectedElement],
  );

  return (
    <ResizeableLayout
      id={'main-timeline'}
      size={0.7}
      vertical
      start={
        <AppContext.Provider value={contextState}>
          <ResizeableLayout
            resizeable={sidebarOpen}
            id={'sidebar-vieport'}
            start={<Sidebar setOpen={setSidebarOpen} />}
            end={<Viewport />}
          />
        </AppContext.Provider>
      }
      end={<Timeline />}
    />
  );
}
