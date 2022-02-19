import {TimeTween} from './TimeTween';
import {Project} from '../Project';

export function* tween(
  this: Project,
  duration: number,
  callback: (value: TimeTween) => void,
): Generator {
  const frames = duration * this.framesPerSeconds;
  let startFrame = this.frame;
  const timeTween = new TimeTween(0);
  while (this.frame - startFrame < frames) {
    timeTween.value = (this.frame - startFrame) / frames;
    callback(timeTween);
    yield;
  }
  timeTween.value = 1;
  callback(timeTween);
}
