import {Project} from './Project';

export function Player(factory: () => Project) {
  const project = factory();
  project.start();
  const interval = setInterval(() => {
    if (project.next()) {
      project.start();
      project.next();
      // clearInterval(interval);
    }
  }, 1000 / project.framesPerSeconds);
}
