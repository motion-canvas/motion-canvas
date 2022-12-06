/* eslint-disable @typescript-eslint/no-unused-vars */

import {describe, test, beforeEach, expect} from 'vitest';
import {Project} from '../Project';
import {setProject, useProject, useTime} from '../utils';
import {threads} from '../threading';
import {waitFor} from './scheduling';

describe('waitFor()', () => {
  beforeEach(() => {
    setProject(new Project({name: 'tests', scenes: []}));
  });

  test('Framerate-independent wait duration', () => {
    const project = useProject();

    let time60;
    const task60 = threads(function* () {
      yield* waitFor(3.1415);
      time60 = useTime();
    });

    let time24;
    const task24 = threads(function* () {
      yield* waitFor(3.1415);
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
      yield* waitFor(0.15);
      yield* waitFor(0.15);
      yield* waitFor(0.15);
      time = useTime();
    });

    project.framerate = 10;
    project.frame = 0;
    for (const _ of task) {
      project.frame++;
    }

    expect(project.frame).toBe(4);
    expect(time).toBeCloseTo(0.45);
  });
});
