import {PresenterState} from '@motion-canvas/core';
import {useEffect} from 'preact/hooks';
import styles from './Editor.module.scss';
import {Console} from './components/console';
import {Footer} from './components/footer';
import {ElementSwitch, Navigation, ResizeableLayout} from './components/layout';
import {PresentationMode} from './components/presentation';
import {Settings, Threads, VideoSettings} from './components/sidebar';
import {Timeline} from './components/timeline';
import {Viewport} from './components/viewport';
import {usePanels} from './contexts';
import {useShortcutContext} from './contexts/shortcuts';
import {usePresenterState} from './hooks';
import {EditorPanel} from './signals';

export function Editor() {
  const state = usePresenterState();
  const {sidebar, bottom} = usePanels();
  const {global} = useShortcutContext();

  useEffect(() => {
    global.value = state === PresenterState.Initial ? 'editor' : 'presenter';
  }, [state]);

  return state === PresenterState.Initial ? (
    <div className={styles.root}>
      <Navigation />
      <ResizeableLayout
        id={`main-timeline`}
        hidden={bottom.isHidden}
        offset={-160}
        vertical
      >
        <ResizeableLayout
          id={`sidebar-viewport`}
          hidden={sidebar.isHidden}
          offset={400}
        >
          <ElementSwitch
            value={sidebar.current.value}
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
          value={bottom.current.value}
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
