import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from '../threading';
import {useThread} from '../utils';

decorate(tween, threadable());
export function* tween(
  seconds: number,
  onProgress: (value: number, time: number) => void,
  onEnd?: (value: number, time: number) => void,
): ThreadGenerator {
  const thread = useThread();

  const startTime = thread.time();
  const endTime = thread.time() + seconds;

  onProgress(0, 0);
  while (endTime > thread.fixed) {
    const time = thread.fixed - startTime;
    const value = time / seconds;
    if (time > 0) {
      onProgress(value, time);
    }
    yield;
  }
  thread.time(endTime);

  onProgress(1, seconds);
  onEnd?.(1, seconds);
}
