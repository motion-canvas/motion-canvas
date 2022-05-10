import type {Project} from '../Project';
import type {Scene} from '../Scene';
import {decorate, threadable} from '../decorators';
import {PROJECT, SCENE} from '../symbols';
import {ThreadGenerator} from '../threading';

decorate(waitUntil, threadable());
export function waitUntil(
  time: number,
  after?: ThreadGenerator,
): ThreadGenerator;
export function waitUntil(
  event: string,
  after?: ThreadGenerator,
): ThreadGenerator;
export function* waitUntil(
  targetTime: number | string = 0,
  after?: ThreadGenerator,
): ThreadGenerator {
  const scene: Scene = yield SCENE;
  const frames =
    typeof targetTime === 'string'
      ? scene.getFrameEvent(targetTime)
      : scene.project.secondsToFrames(targetTime);

  while (scene.project.frame < frames) {
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
  const project: Project = yield PROJECT;
  const frames = project.secondsToFrames(seconds);
  const startFrame = project.frame;
  while (project.frame - startFrame < frames) {
    yield;
  }

  if (after) {
    yield* after;
  }
}
