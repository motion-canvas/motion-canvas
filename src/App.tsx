import {Sidebar} from './components/sidebar';
import {Timeline} from './components/timeline';
import {Viewport} from './components/viewport';

import './index.scss';
import {ResizeableLayout} from './components/layout';
import {useState} from 'preact/hooks';

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <main>
      <ResizeableLayout
        id={'main-timeline'}
        vertical
        start={
          <ResizeableLayout
            resizeable={sidebarOpen}
            id={'sidebar-vieport'}
            start={<Sidebar setOpen={setSidebarOpen} />}
            end={<Viewport />}
          />
        }
        end={<Timeline />}
      />
    </main>
  );
}

export const AppNode = <App />;
