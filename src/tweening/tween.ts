import {TimeTween} from './TimeTween';

export function* tween(duration: number, callback: (value: TimeTween) => void): Generator {
  let time = 0;
  const timeTween = new TimeTween(0);
  while (time < duration) {
    timeTween.value = time / duration;
    callback(timeTween);
    time += 1 / 60;
    yield;
  }
  timeTween.value = 1;
  callback(timeTween);
}
