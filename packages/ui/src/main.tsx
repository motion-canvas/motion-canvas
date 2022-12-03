import './index.scss';

import type {Project} from '@motion-canvas/core/lib';
import {Player} from '@motion-canvas/core/lib/player';
import {ComponentChild, render} from 'preact';
import {Editor} from './Editor';
import {Index, ProjectData} from './Index';
import {
  InspectionProvider,
  LoggerProvider,
  PlayerProvider,
  ProjectProvider,
} from './contexts';

function renderRoot(vnode: ComponentChild) {
  const root = document.createElement('main');
  document.body.appendChild(root);
  render(vnode, root);
}

export function editor(project: Project) {
  project.logger.onLogged.subscribe(log => {
    const {level, message, stack, object, durationMs, ...rest} = log;
    const fn = console[level as 'error'] ?? console.log;
    fn(message, ...[object, durationMs, rest].filter(part => !!part));
    if (stack) {
      fn(stack);
    }
  });

  const player = new Player(project);
  const playerKey = `${project.name}/player`;
  const frameKey = `${project.name}/frame`;
  const state = localStorage.getItem(playerKey);
  const frame = localStorage.getItem(frameKey);
  if (state) {
    player.loadState(JSON.parse(state));
  }
  if (frame) {
    player.requestSeek(parseInt(frame));
  }
  player.onStateChanged.subscribe(state => {
    localStorage.setItem(playerKey, JSON.stringify(state));
  });
  player.onFrameChanged.subscribe(frame => {
    localStorage.setItem(frameKey, frame.toString());
  });

  document.title = `${project.name} | Motion Canvas`;
  renderRoot(
    <PlayerProvider player={player}>
      <ProjectProvider project={project}>
        <LoggerProvider>
          <InspectionProvider>
            <Editor />
          </InspectionProvider>
        </LoggerProvider>
      </ProjectProvider>
    </PlayerProvider>,
  );
}

export function index(projects: ProjectData[]) {
  renderRoot(<Index projects={projects} />);
}
