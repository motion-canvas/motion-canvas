import './index.scss';

import {
  Player,
  Presenter,
  Renderer,
  errorToLog,
  experimentalLog,
  type Project,
} from '@motion-canvas/core';
import {ComponentChild, render} from 'preact';
import {Editor} from './Editor';
import {ProjectData, ProjectSelection} from './ProjectSelection';
import {ApplicationProvider} from './contexts';
import {ShortcutsProvider} from './contexts/shortcuts';
import {EditorPlugin} from './plugin';
import GridPlugin from './plugin/GridPlugin';
import {projectNameSignal} from './signals';
import {getItem, setItem} from './utils';

function renderRoot(vnode: ComponentChild) {
  const root = document.createElement('main');
  document.body.appendChild(root);
  render(vnode, root);
}

export async function editor(project: Project) {
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

  const promises: Promise<EditorPlugin>[] = [];
  for (const plugin of project.plugins) {
    if (plugin.editorPlugin) {
      if (
        !project.experimentalFeatures &&
        !plugin.name.startsWith('@motion-canvas')
      ) {
        project.logger.log(
          experimentalLog(
            `Plugin "${plugin.name}" tried to register an editor plugin.`,
          ),
        );
        continue;
      }

      promises.push(
        import(/* @vite-ignore */ `/@id/${plugin.editorPlugin}`).then(module =>
          module.default(),
        ),
      );
    }
  }

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

  const plugins: EditorPlugin[] = [GridPlugin()];
  try {
    plugins.push(...(await Promise.all(promises)));
  } catch (error) {
    project.logger.error(errorToLog(error));
  }

  renderRoot(
    <ApplicationProvider
      application={{
        player,
        renderer,
        presenter,
        project,
        meta,
        settings,
        plugins,
      }}
    >
      <ShortcutsProvider>
        <Editor />
      </ShortcutsProvider>
    </ApplicationProvider>,
  );
}

export function index(projects: ProjectData[]) {
  renderRoot(<ProjectSelection projects={projects} />);
}

export * from './components/animations';
export * from './components/controls';
export * from './components/fields';
export * from './components/icons';
export * from './components/layout';
export * from './components/meta';
export * from './components/tabs';
export * from './contexts';
export * from './hooks';
export * from './plugin';
export * from './signals';
export * from './utils';
