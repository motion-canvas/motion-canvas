import './index.scss';

import type {Project} from '@motion-canvas/core/lib';
import {Player} from '@motion-canvas/core/lib/player';
import {ComponentChild, render} from 'preact';
import {Editor} from './Editor';
import {Index, ProjectData} from './Index';
import {InspectionProvider, PlayerProvider, ProjectProvider} from './contexts';

function renderRoot(vnode: ComponentChild) {
  const root = document.createElement('main');
  document.body.appendChild(root);
  render(vnode, root);
}

export function editor(project: Project) {
  const player = new Player(project);
  document.title = `${project.name} | Motion Canvas`;
  renderRoot(
    <PlayerProvider player={player}>
      <ProjectProvider project={project}>
        <InspectionProvider>
          <Editor />
        </InspectionProvider>
      </ProjectProvider>
    </PlayerProvider>,
  );
}

export function index(projects: ProjectData[]) {
  renderRoot(<Index projects={projects} />);
}
