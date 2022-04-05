import type {Project} from '../Project';
import {decorate, threadable} from '../decorators';
import {PROJECT} from '../symbols';
import {ThreadGenerator} from '../threading';

decorate(waitUntil, threadable());
export function* waitUntil(
  targetTime = 0,
  after?: ThreadGenerator,
): ThreadGenerator {
  const project = (yield PROJECT) as Project;
  const frames = project.secondsToFrames(targetTime);
  while (project.frame < frames) {
    yield;
  }

  if (after) {
    yield* after;
  }
}

decorate(waitFor, threadable());
export function* waitFor(
  seconds = 0,
  after?: ThreadGenerator,
): ThreadGenerator {
  const project = (yield PROJECT) as Project;
  const frames = project.secondsToFrames(seconds);
  const startFrame = project.frame;
  while (project.frame - startFrame < frames) {
    yield;
  }

  if (after) {
    yield* after;
  }
}
