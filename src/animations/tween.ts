import {TimeTween} from './TimeTween';
import {PROJECT, Project} from '../Project';
import {decorate, threadable} from "../decorators";

decorate(tween, threadable());
export function* tween(
  duration: number,
  callback: (value: TimeTween, time: number) => void,
): Generator {
  const project = (yield PROJECT) as Project;
  const frames = project.secondsToFrames(duration);
  let startFrame = project.frame;
  const timeTween = new TimeTween(0);
  while (project.frame - startFrame < frames) {
    const time = project.framesToSeconds(project.frame - startFrame);
    timeTween.value = (project.frame - startFrame) / frames;
    callback(timeTween, time);
    yield;
  }
  timeTween.value = 1;
  callback(timeTween, project.framesToSeconds(frames));
}
