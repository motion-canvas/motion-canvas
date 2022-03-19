import {TimeTween} from './TimeTween';
import {Project} from '../Project';

export function* tween(
  this: Project,
  duration: number,
  callback: (value: TimeTween, time: number) => void,
): Generator {
  const frames = this.secondsToFrames(duration);
  let startFrame = this.frame;
  const timeTween = new TimeTween(0);
  while (this.frame - startFrame < frames) {
    const time = this.framesToSeconds(this.frame - startFrame);
    timeTween.value = (this.frame - startFrame) / frames;
    callback(timeTween, time);
    yield;
  }
  timeTween.value = 1;
  callback(timeTween, this.framesToSeconds(frames));
}
