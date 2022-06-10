import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from '../threading';
import { useProject } from "../utils";

decorate(tween, threadable());
export function* tween(
  duration: number,
  onProgress: (value: number, time: number) => void,
  onEnd?: (value: number, time: number) => void,
): ThreadGenerator {
  const project = useProject();
  const frames = project.secondsToFrames(duration);
  const startFrame = project.frame;
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
