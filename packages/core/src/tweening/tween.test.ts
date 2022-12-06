/* eslint-disable @typescript-eslint/no-unused-vars */

import {describe, test, beforeEach, expect} from 'vitest';
import {Project} from '../Project';
import {setProject, useProject, useTime} from '../utils';
import {threads} from '../threading';
import {tween} from './tween';

describe('tween()', () => {
  beforeEach(() => {
    setProject(new Project({name: 'tests', scenes: []}));
  });

  test('Framerate-independent tween duration', () => {
    const project = useProject();

    let time60;
    const task60 = threads(function* () {
      yield* tween(3.1415, () => {
        // do nothing
      });
      time60 = useTime();
    });

    let time24;
    const task24 = threads(function* () {
      yield* tween(3.1415, () => {
        // do nothing
      });
      time24 = useTime();
    });

    project.framerate = 60;
    project.frame = 0;
    for (const _ of task60) {
      project.frame++;
    }

    project.framerate = 24;
    project.frame = 0;
    for (const _ of task24) {
      project.frame++;
    }

    expect(time60).toBeCloseTo(3.1415);
    expect(time24).toBeCloseTo(3.1415);
  });

  test('Accumulated time offset', () => {
    const project = useProject();

    let time: number;
    const task = threads(function* () {
      yield* tween(0.45, () => {
        // do nothing
      });
      time = useTime();
    });

    project.framerate = 10;
    project.frame = 0;
    for (const _ of task) {
      project.frame++;
    }

    expect(project.frame).toBe(5);
    expect(time).toBeCloseTo(0.45);
  });
});
