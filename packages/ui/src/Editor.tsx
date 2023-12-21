import {PresenterState} from '@motion-canvas/core';
import styles from './Editor.module.scss';
import {Console} from './components/console';
import {Footer} from './components/footer';
import {ElementSwitch, Navigation, ResizeableLayout} from './components/layout';
import {PresentationMode} from './components/presentation';
import {Settings, Threads, VideoSettings} from './components/sidebar';
import {Timeline} from './components/timeline';
import {Viewport} from './components/viewport';
import {usePresenterState} from './hooks';
import {BottomPanel, EditorPanel, SidebarPanel} from './signals';

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
            value={SidebarPanel.value}
            cases={{
              [EditorPanel.VideoSettings]: VideoSettings,
              [EditorPanel.Threads]: Threads,
              [EditorPanel.Console]: Console,
              [EditorPanel.Settings]: Settings,
            }}
          />
          <Viewport />
        </ResizeableLayout>
        <ElementSwitch
          value={BottomPanel.value}
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
