import {Project} from '../Project';

export function* sequence(
  this: Project,
  delay: number,
  ...sequences: Generator[]
): Generator {
  const delayFrames = this.secondsToFrames(delay);
  const startFrame = this.frame;
  let finished = 0;
  while (finished < sequences.length) {
    finished = 0;

    const frames = this.frame - startFrame;
    const amount = Math.floor(frames / delayFrames) + 1;

    for (let i = 0; i < Math.min(sequences.length, amount); i++) {
      if (sequences[i].next().done) {
        finished++;
      }
    }

    yield;
  }
}
