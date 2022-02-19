import {Project} from './Project';

const MINIMUM_ANIMATION_DURATION = 1000;

export function Player(factory: () => Project) {
  const project = factory();
  let startTime = performance.now();
  project.start();
  const run = () => {
    try {
      if (project.next()) {
        // Prevent animation from restarting too quickly.
        const animationDuration = performance.now() - startTime;
        if (animationDuration < MINIMUM_ANIMATION_DURATION) {
          setTimeout(run, MINIMUM_ANIMATION_DURATION - animationDuration);
          return;
        }

        startTime = performance.now();
        project.start();
        project.next();
      }
      requestAnimationFrame(run);
    } catch (e) {
      console.error(e);
    }
  };
  run();
}
