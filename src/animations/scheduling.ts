import type {Project} from '../Project';

export function* waitUntil(
  this: Project,
  targetTime = 0,
  after?: Generator,
): Generator {
  const frames = this.secondsToFrames(targetTime);
  while (this.frame < frames) {
    yield;
  }

  if (after) {
    yield* after;
  }
}

export function* waitFor(
  this: Project,
  seconds = 0,
  after?: Generator,
): Generator {
  const frames = this.secondsToFrames(seconds);
  const startFrame = this.frame;
  while (this.frame - startFrame < frames) {
    yield;
  }

  if (after) {
    yield* after;
  }
}
