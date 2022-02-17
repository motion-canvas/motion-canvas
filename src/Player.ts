import {Project} from './Project';

export function Player(factory: () => Project) {
  const project = factory();
  project.start();
  const run = () => {
    try {
      if (project.next()) {
        project.start();
        project.next();
      }
      requestAnimationFrame(run);
    } catch (e) {
    }
  }
  run();
}
