import {Footer} from './components/footer';
import {Viewport} from './components/viewport';
import {Navigation, ElementSwitch, ResizeableLayout} from './components/layout';
import {usePresenterState} from './hooks';
import {PresenterState} from '@motion-canvas/core';
import {PresentationMode} from './components/presentation';
import {EditorPanel, BottomPanel, SidebarPanel} from './signals';
import {Timeline} from './components/timeline';
import {Console} from './components/console';
import KeyCodes from './utils/KeyCodes';
import { ModuleShortcuts, UIAction } from './global';
import {
  Properties,
  Settings,
  Threads,
  VideoSettings,
} from './components/sidebar';
import styles from './Editor.module.scss';


export interface GlobalActions {
  ZOOM_TO_FIT: string,
  TOGGLE_PLAYBACK: string,
  PREVIOUS_FRAME: string,
  NEXT_FRAME: string,
  TO_FIRST_FRAME: string,
  TO_LAST_FRAME: string,
  TOGGLE_AUDIO: string,
  TOGGLE_LOOP: string,
}

export const GlobalKeyBindings : ModuleShortcuts<GlobalActions> = {
  ZOOM_TO_FIT: new UIAction('Zoom to fit', KeyCodes.KEY_0),
  TOGGLE_PLAYBACK:  new UIAction('Toggle playback', KeyCodes.SPACEBAR),
  PREVIOUS_FRAME: new UIAction('Previous frame', KeyCodes.LEFT_ARROW),
  NEXT_FRAME: new UIAction('Next frame', KeyCodes.RIGHT_ARROW),
  TO_FIRST_FRAME: new UIAction('Reset to first frame', KeyCodes.LEFT_ARROW.modifier(KeyCodes.SHIFT)),
  TO_LAST_FRAME: new UIAction('Seek to last frame', KeyCodes.RIGHT_ARROW.modifier(KeyCodes.SHIFT)),
  TOGGLE_AUDIO: new UIAction('Toggle audio', KeyCodes.KEY_M),
  TOGGLE_LOOP: new UIAction('Toggle loop', KeyCodes.KEY_L),
}


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
