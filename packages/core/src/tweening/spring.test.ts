/* eslint-disable @typescript-eslint/no-unused-vars */

import {describe, test, beforeEach, expect} from 'vitest';
import {Project} from '../Project';
import {setProject, useProject, useTime} from '../utils';
import {threads} from '../threading';
import {spring, Spring} from './spring';

describe('spring()', () => {
  beforeEach(() => {
    setProject(new Project({name: 'tests', scenes: []}));
  });

  test('Framerate-independent spring duration', () => {
    const project = useProject();

    let timeA;
    // should be around 1.13333333 seconds
    const taskA = threads(function* () {
      yield* spring(
        {
          mass: 0.1,
          stiffness: 20,
          damping: 1.5,
        },
        0,
        300,
        x => {
          // do nothing
        },
      );
      timeA = useTime();
    });

    let timeB;
    const taskB = threads(function* () {
      yield* spring(
        {
          mass: 0.1,
          stiffness: 20,
          damping: 1.5,
        },
        0,
        300,
        x => {
          // do nothing
        },
      );
      timeB = useTime();
    });

    let timeC;
    const taskC = threads(function* () {
      yield* spring(
        {
          mass: 0.1,
          stiffness: 20,
          damping: 1.5,
        },
        0,
        300,
        x => {
          // do nothing
        },
      );
      timeC = useTime();
    });

    project.framerate = 60;
    project.frame = 0;
    for (const _ of taskA) {
      project.frame++;
    }

    project.framerate = 24;
    project.frame = 0;
    for (const _ of taskB) {
      project.frame++;
    }

    project.framerate = 120;
    project.frame = 0;
    for (const _ of taskC) {
      project.frame++;
    }

    expect(timeA).toBeCloseTo(1.5, 0);
    expect(timeB).toBeCloseTo(1.5, 0);
    expect(timeC).toBeCloseTo(1.5, 0);
  });

  test('Accumulated time offset', () => {
    const project = useProject();

    let time;
    const task = threads(function* () {
      yield* spring(
        {
          mass: 0.1,
          stiffness: 20,
          damping: 1.5,
        },
        0,
        300,
        x => {
          // do nothing
        },
      );
      time = useTime();
    });

    project.framerate = 10;
    project.frame = 0;
    for (const _ of task) {
      project.frame++;
    }

    expect(project.frame).toBe(19);
    expect(time).toBeCloseTo(1.5, 0);
  });
});
