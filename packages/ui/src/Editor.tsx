import {Footer} from './components/footer';
import {Viewport} from './components/viewport';
import {Navigation, ElementSwitch, ResizeableLayout} from './components/layout';
import {usePresenterState} from './hooks';
import {PresenterState} from '@motion-canvas/core';
import {PresentationMode} from './components/presentation';
import {EditorPanel, BottomPanel, SidebarPanel} from './signals';
import {Timeline} from './components/timeline';
import {Console} from './components/console';
import {
  Properties,
  Settings,
  Threads,
  VideoSettings,
} from './components/sidebar';
import styles from './Editor.module.scss';

export function Editor() {
  const state = usePresenterState();

  return state === PresenterState.Initial ? (
    <div className={styles.root}>
      <Navigation />
      <ResizeableLayout
        id={`main-timeline`}
        hidden={BottomPanel.isHidden}
        offset={-160}
        vertical
      >
        <ResizeableLayout
          id={`sidebar-viewport`}
          hidden={SidebarPanel.isHidden}
          offset={400}
        >
          <ElementSwitch
            value={SidebarPanel.get()}
            cases={{
              [EditorPanel.VideoSettings]: VideoSettings,
              [EditorPanel.Inspector]: Properties,
              [EditorPanel.Threads]: Threads,
              [EditorPanel.Console]: Console,
              [EditorPanel.Settings]: Settings,
            }}
          />
          <Viewport />
        </ResizeableLayout>
        <ElementSwitch
          value={BottomPanel.get()}
          cases={{
            [EditorPanel.Timeline]: Timeline,
          }}
        />
      </ResizeableLayout>
      <Footer />
    </div>
  ) : (
    <PresentationMode />
  );
}
