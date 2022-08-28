import {Sidebar} from './components/sidebar';
import {Timeline} from './components/timeline';
import {Viewport} from './components/viewport';
import {ResizeableLayout} from './components/layout';
import {useState} from 'preact/hooks';

export function Editor() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ResizeableLayout
      id={'main-timeline'}
      size={0.7}
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
  );
}
