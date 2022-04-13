import {Sidebar} from './components/sidebar';
import {Timeline} from './components/timeline';
import {Viewport} from './components/viewport';

import './index.scss';
import {ResizeableLayout} from './components/layout';

export function App() {
  return (
    <main>
      <ResizeableLayout
        id={'main-timeline'}
        vertical
        left={<ResizeableLayout id={'sidebar-vieport'} left={<Sidebar />} right={<Viewport />} />}
        right={<Timeline />}
      />
    </main>
  );
}
