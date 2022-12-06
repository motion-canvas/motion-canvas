/* eslint-disable @typescript-eslint/no-unused-vars */

import {describe, test, beforeEach, expect} from 'vitest';
import {Project} from '../Project';
import {setProject, useProject, useTime} from '../utils';
import {waitFor} from '../flow';
import {threads} from './threads';
import {join} from './join';
import {cancel} from './cancel';

describe('cancel()', () => {
  beforeEach(() => {
    setProject(new Project({name: 'tests', scenes: []}));
  });

  test('Elapsed time when canceling a thread', () => {
    const project = useProject();

    let time: number;
    const task = threads(function* () {
      const waitTask = yield waitFor(2);
      cancel(waitTask);
      yield* join(waitTask);
      time = useTime();
    });

    project.framerate = 10;
    project.frame = 0;
    for (const _ of task) {
      project.frame++;
    }

    expect(time).toBeCloseTo(0);
  });
});
