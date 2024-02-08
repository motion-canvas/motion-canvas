import './index.scss';

import type {Project} from '@motion-canvas/core';
import {Player, Presenter, Renderer} from '@motion-canvas/core';
import {ComponentChild, render} from 'preact';
import {Editor} from './Editor';
// import {CustomStageOverlay} from "./components/viewport/CustomStageOverlay"
// import type {CustomStageOverlayPropsType, CustomStageOverlayType} from "./components/viewport/CustomStageOverlay"
import {Index, ProjectData} from './Index';
import {
  InspectionProvider,
  LoggerProvider,
  ApplicationProvider,
} from './contexts';
import {getItem, setItem} from './utils';
import {ShortcutsProvider} from './contexts/shortcuts';
import {projectNameSignal} from './signals';

function renderRoot(vnode: ComponentChild) {
  const root = document.createElement('main');
  document.body.appendChild(root);
  render(vnode, root);
}

// export * from "../src/components/viewport/CustomStageOverlay"

// export const stageOverlay = CustomStageOverlay;

export function editor(project: Project) {
  Error.stackTraceLimit = Infinity;
  projectNameSignal.value = project.name;

  project.logger.onLogged.subscribe(log => {
    const {level, message, stack, object, durationMs, ...rest} = log;
    const fn = console[level as 'error'] ?? console.log;
    fn(message, ...[object, durationMs, rest].filter(part => !!part));
    if (stack) {
      fn(stack);
    }
  });

  const renderer = new Renderer(project);
  project.plugins.forEach(plugin => plugin.renderer?.(renderer));

  const presenter = new Presenter(project);
  project.plugins.forEach(plugin => plugin.presenter?.(presenter));

  const settings = project.settings;
  settings.appearance.color.onChanged.subscribe(() => {
    const color = settings.appearance.color.get();
    if (color) {
      document.body.style.setProperty('--theme', color.css());
      document.body.style.setProperty(
        '--theme-light',
        color.brighten(0.54).css(),
      );
      document.body.style.setProperty(
        '--theme-overlay',
        color.alpha(0.16).css(),
      );
    } else {
      document.body.style.removeProperty('--theme');
      document.body.style.removeProperty('--theme-light');
      document.body.style.removeProperty('--theme-overlay');
    }
  });
  settings.appearance.font.onChanged.subscribe(() => {
    if (settings.appearance.font.get()) {
      document.body.style.setProperty('--font-family', 'JetBrains Mono');
    } else {
      document.body.style.removeProperty('--font-family');
    }
  });

  const meta = project.meta;
  const playerKey = `${project.name}/player`;
  const frameKey = `${project.name}/frame`;
  const player = new Player(
    project,
    meta.getFullPreviewSettings(),
    getItem(playerKey, {}),
    getItem(frameKey, -1),
  );
  project.plugins.forEach(plugin => plugin.player?.(player));

  player.onStateChanged.subscribe(state => {
    setItem(playerKey, state);
  });
  player.onFrameChanged.subscribe(frame => {
    setItem(frameKey, frame);
  });

  const updatePlayer = () => {
    player.configure(meta.getFullPreviewSettings());
  };
  meta.shared.onChanged.subscribe(updatePlayer);
  meta.preview.onChanged.subscribe(updatePlayer);

  document.title = `${project.name} | Motion Canvas`;
  renderRoot(
    <ApplicationProvider
      application={{
        player,
        renderer,
        presenter,
        project,
        meta,
        settings,
        // customStageOverlay
      }}
    >
      <ShortcutsProvider>
        <LoggerProvider>
          <InspectionProvider>
            <Editor />
          </InspectionProvider>
        </LoggerProvider>
      </ShortcutsProvider>
    </ApplicationProvider>,
  );
}


export function index(projects: ProjectData[]) {
  renderRoot(<Index projects={projects} />);
}
