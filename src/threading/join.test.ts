/* eslint-disable @typescript-eslint/no-unused-vars */

import {Project} from '../Project';
import {setProject, useProject, useTime} from '../utils';
import {waitFor} from '../flow';
import {threads} from './threads';
import {join} from './join';

describe('join()', () => {
  beforeEach(() => {
    setProject(new Project({name: 'tests', scenes: []}));
  });

  test('Elapsed time when joining all threads', () => {
    const project = useProject();

    let time: number;
    const task = threads(function* () {
      const taskA = yield waitFor(0.15);
      const taskB = yield waitFor(0.17);
      yield* join(taskA, taskB);
      time = useTime();
    });

    project.framerate = 10;
    project.frame = 0;
    for (const _ of task) {
      project.frame++;
    }

    expect(time).toBeCloseTo(0.17);
  });

  test('Elapsed time when joining any thread', () => {
    const project = useProject();

    let time: number;
    const task = threads(function* () {
      const taskA = yield waitFor(0.15);
      const taskB = yield waitFor(0.17);
      yield* join(false, taskA, taskB);
      time = useTime();
    });

    project.framerate = 10;
    project.frame = 0;
    for (const _ of task) {
      project.frame++;
    }

    expect(time).toBeCloseTo(0.15);
  });

  test('Elapsed time when joining an already canceled thread', () => {
    const project = useProject();

    let time: number;
    const task = threads(function* () {
      const waitTask = yield waitFor(0.15);
      yield* waitFor(0.2);
      yield* join(waitTask);
      time = useTime();
    });

    project.framerate = 10;
    project.frame = 0;
    for (const _ of task) {
      project.frame++;
    }

    expect(time).toBeCloseTo(0.2);
  });

  test('Elapsed time when joining a thread right after cancellation', () => {
    const project = useProject();

    let time: number;
    const task = threads(function* () {
      const waitTask = yield waitFor(0.05);
      yield* join(waitTask);
      time = useTime();
    });

    project.framerate = 10;
    project.frame = 0;
    for (const _ of task) {
      project.frame++;
    }

    expect(time).toBeCloseTo(0.05);
  });
});
