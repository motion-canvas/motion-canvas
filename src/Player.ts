import {Project} from './Project';

const MINIMUM_ANIMATION_DURATION = 1000;
const MAX_AUDIO_DESYNC = 1 / 50;

export function Player(factory: () => Project, audioSrc?: string) {
  const project = factory();
  let startTime = performance.now();
  let audio: HTMLAudioElement;
  if (audioSrc) {
    audio = new Audio(audioSrc);
    audio.play();
  }

  project.start();
  const run = () => {
    if (audio?.currentTime < project.time) {
      requestAnimationFrame(run);
      return;
    }

    try {
      let finished = project.next();

      // Synchronize animation with audio.
      if (audio?.currentTime - MAX_AUDIO_DESYNC > project.time) {
        while (audio.currentTime > project.time && !finished) {
          finished = project.next();
        }
      }

      if (finished) {
        // Prevent animation from restarting too quickly.
        const animationDuration = performance.now() - startTime;
        if (animationDuration < MINIMUM_ANIMATION_DURATION) {
          setTimeout(run, MINIMUM_ANIMATION_DURATION - animationDuration);
          return;
        }

        startTime = performance.now();
        project.start();
        project.next();
        if (audio) {
          audio.currentTime = 0;
        }
      }

      requestAnimationFrame(run);
    } catch (e) {
      console.error(e);
    }
  };
  run();
}
