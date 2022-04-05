import {decorate, threadable} from '../decorators';
import type {Project} from '../Project';
import {PROJECT} from '../symbols';
import {ThreadGenerator} from '../threading';

decorate(tween, threadable());
export function* tween(
  duration: number,
  onProgress: (value: number, time: number) => void,
  onEnd?: (value: number, time: number) => void,
): ThreadGenerator {
  const project = (yield PROJECT) as Project;
  const frames = project.secondsToFrames(duration);
  let startFrame = project.frame;
  let value = 0;
  while (project.frame - startFrame < frames) {
    const time = project.framesToSeconds(project.frame - startFrame);
    value = (project.frame - startFrame) / frames;
    onProgress(value, time);
    yield;
  }
  value = 1;
  onProgress(value, project.framesToSeconds(frames));
  onEnd?.(value, project.framesToSeconds(frames));
}
