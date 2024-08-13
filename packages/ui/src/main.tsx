import './index.scss';

import {
  Player,
  Presenter,
  Renderer,
  RendererResult,
  RendererSettings,
  experimentalLog,
  type Project,
} from '@motion-canvas/core';
import {ComponentChild, render} from 'preact';
import {Editor} from './Editor';
import {ProjectData, ProjectSelection} from './ProjectSelection';
import {ApplicationProvider, PanelsProvider} from './contexts';
import {ShortcutsProvider} from './contexts/shortcuts';
import GridPlugin from './plugin/GridPlugin';
import {projectNameSignal} from './signals';
import {getItem, setItem} from './utils';

const ExperimentalHooks = [
  'tabs',
  'provider',
  'previewOverlay',
  'presenterOverlay',
] as const;

function renderRoot(vnode: ComponentChild) {
  const root = document.createElement('main');
  document.body.appendChild(root);
  render(vnode, root);
}

function setupProject(project: Project) {
  Error.stackTraceLimit = Infinity;
  if (!project.experimentalFeatures) {
    for (const plugin of project.plugins) {
      if (plugin.name.startsWith('@motion-canvas')) {
        continue;
      }

      const experimental = ExperimentalHooks.filter(key => key in plugin);
      if (experimental.length > 0) {
        project.logger.log(
          experimentalLog(
            `Plugin "${
              plugin.name
            }" uses experimental editor hooks: ${experimental.join(', ')}.`,
          ),
        );
      }
    }
  }
}

export function editor(project: Project) {
  setupProject(project);

  project.logger.onLogged.subscribe(log => {
    const {level, message, stack, object, durationMs, ...rest} = log;
    const fn = console[level as 'error'] ?? console.log;
    fn(message, ...[object, durationMs, rest].filter(part => !!part));
    if (stack) {
      fn(stack);
    }
  });

  projectNameSignal.value = project.name;

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

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const startInPresenter = urlParams.has('present');
  const startInRenderer = urlParams.has('render');

  if (startInPresenter) {
    presenter.present({
      ...meta.getFullRenderingSettings(),
      name: project.name,
      slide: null,
    });
  }

  if (startInRenderer) {
    renderer.render({
      ...meta.getFullRenderingSettings(),
      name: project.name,
    });
  }

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

  const plugins = [GridPlugin(), ...project.plugins];

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
      <PanelsProvider>
        <ShortcutsProvider>
          <Editor />
        </ShortcutsProvider>
      </PanelsProvider>
    </ApplicationProvider>,
  );
}

export function headless(
  project: Project,
  settings: Partial<RendererSettings> = {},
) {
  setupProject(project);

  project.logger.onLogged.subscribe(log => {
    console.log(log);
    window.dispatchEvent(new CustomEvent('log', {detail: log}));
  });

  const renderer = new Renderer(project);
  project.plugins.forEach(plugin => plugin.renderer?.(renderer));

  renderer.onFinished.subscribe(result => {
    let stringResult: string;
    if (result === RendererResult.Success) {
      stringResult = 'success';
    } else if (result === RendererResult.Aborted) {
      stringResult = 'aborted';
    } else {
      stringResult = 'error';
    }
    window.dispatchEvent(new CustomEvent('renderend', {detail: stringResult}));
  });

  renderer.onFrameChanged.subscribe(frame => {
    window.dispatchEvent(
      new CustomEvent('render', {
        detail: {
          frame,
          //@ts-ignore
          total: renderer.playback.duration,
        },
      }),
    );
  });

  const metaSettings = project.meta.getFullRenderingSettings();
  let exporterName = metaSettings.exporter.name;
  let exporterOptions = metaSettings.exporter.options;
  if (settings.exporter) {
    if (
      (!settings.exporter.name || settings.exporter.name === exporterName) &&
      settings.exporter.options &&
      exporterOptions &&
      typeof settings.exporter.options === 'object' &&
      typeof exporterOptions === 'object'
    ) {
      exporterOptions = {...exporterOptions, ...settings.exporter.options};
    } else {
      exporterName = settings.exporter.name ?? exporterName;
      exporterOptions = settings.exporter.options;
    }
  }

  renderer.render({
    ...project.meta.getFullRenderingSettings(),
    ...settings,
    exporter: {
      name: exporterName,
      options: exporterOptions,
    },
    name: project.name,
  });

  window.dispatchEvent(new Event('renderstart'));
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
