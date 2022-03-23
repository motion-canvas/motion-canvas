import {TimeTween} from './TimeTween';
import {PROJECT, Project} from '../Project';
import {decorate, threadable} from "../decorators";

decorate(tween, threadable());
export function* tween(
  duration: number,
  onProgress: (value: TimeTween, time: number) => void,
  onEnd?: (value: TimeTween, time: number) => void,
): Generator {
  const project = (yield PROJECT) as Project;
  const frames = project.secondsToFrames(duration);
  let startFrame = project.frame;
  const timeTween = new TimeTween(0);
  while (project.frame - startFrame < frames) {
    const time = project.framesToSeconds(project.frame - startFrame);
    timeTween.value = (project.frame - startFrame) / frames;
    onProgress(timeTween, time);
    yield;
  }
  timeTween.value = 1;
  onProgress(timeTween, project.framesToSeconds(frames));
  onEnd?.(timeTween, project.framesToSeconds(frames));
}
