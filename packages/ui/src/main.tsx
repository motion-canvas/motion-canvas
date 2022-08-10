import type {Project} from '@motion-canvas/core/lib';
import {Player} from '@motion-canvas/core/lib/player';
import {render} from 'preact';
import {App} from './App';
import {PlayerProvider, ProjectProvider} from './contexts';

export default (project: Project) => {
  const app = document.createElement('main');
  const player = new Player(project);
  document.body.appendChild(app);
  document.title = `${project.name} | Motion Canvas`;
  render(
    <PlayerProvider player={player}>
      <ProjectProvider project={project}>
        <App />
      </ProjectProvider>
    </PlayerProvider>,
    app,
  );
};
