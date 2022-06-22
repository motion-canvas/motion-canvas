import './index.scss';

import {Sidebar} from './components/sidebar';
import {Timeline} from './components/timeline';
import {Viewport} from './components/viewport';
import {ResizeableLayout} from './components/layout';
import {useState, useMemo} from 'preact/hooks';
import type {Node} from 'konva/lib/Node';
import {AppContext} from './AppContext';

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const contextState = useMemo(
    () => ({
      selectedNode,
      setSelectedNode,
    }),
    [selectedNode],
  );

  return (
    <ResizeableLayout
      id={'main-timeline'}
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

export const AppNode = <App />;
