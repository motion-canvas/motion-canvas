import {ThreadGenerator} from '../threading';
import {decorate, threadable} from '../decorators';
import {useProject} from '../utils';

export function every(seconds: number, callback: (frame: number) => void) {
  let changed = false;
  decorate(everyRunner, threadable('every'));
  function* everyRunner(): ThreadGenerator {
    const project = useProject();
    let acc = 0;
    let tick = 0;
    callback(tick);
    changed = true;

    while (true) {
      if (acc >= project.secondsToFrames(seconds)) {
        acc = 0;
        tick++;
        callback(tick);
        changed = true;
      } else {
        changed = false;
      }
      acc++;
      yield;
    }
  }

  return {
    runner: everyRunner(),
    setSeconds(value: number) {
      seconds = value;
      changed = false;
    },
    setCallback(value: (frame: number) => void) {
      callback = value;
      changed = false;
    },
    *sync(): ThreadGenerator {
      while (!changed) {
        yield;
      }
    },
  };
}
