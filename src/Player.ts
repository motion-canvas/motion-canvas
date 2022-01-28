import {Project} from './Project';

export function Player(factory: () => Project) {
  const project = factory();
  const interval = setInterval(() => {
    if (project.next()) {
      clearInterval(interval);
    }
  }, 1000 / project.framesPerSeconds);
}
