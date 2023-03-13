import './index.scss';

import type {Project} from '@motion-canvas/core';
import {Player, Presenter, Renderer} from '@motion-canvas/core';
import {ComponentChild, render} from 'preact';
import {Editor} from './Editor';
import {Index, ProjectData} from './Index';
import {
  InspectionProvider,
  LoggerProvider,
  ApplicationProvider,
  useApplication,
} from './contexts';
import {getItem, setItem} from './utils';
import {ShortcutsProvider} from './contexts/shortcuts';

function renderRoot(vnode: ComponentChild) {
  const root = document.createElement('main');
  document.body.appendChild(root);
  render(vnode, root);
}

export function editor(project: Project) {
  Error.stackTraceLimit = Infinity;

  project.logger.onLogged.subscribe(log => {
    const {level, message, stack, object, durationMs, ...rest} = log;
    const fn = console[level as 'error'] ?? console.log;
    fn(message, ...[object, durationMs, rest].filter(part => !!part));
    if (stack) {
      fn(stack);
    }
  });


  const renderer = new Renderer(project);
  const presenter = new Presenter(project);

  const meta = project.meta;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const startInPresenter = urlParams.has('present')
  
  if (startInPresenter) {
    presenter.present({
      ...meta.getFullRenderingSettings(),
      name: project.name,
      slide: null,
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
