import {Vector2, createSignal, range} from '@motion-canvas/core';
import {describe, expect, it} from 'vitest';
import {Circle} from '../Circle';
import {Node} from '../Node';
import {mockScene2D} from './mockScene2D';

describe('clone', () => {
  mockScene2D();

  it('Normal clone', () => {
    const signal = createSignal(45);
    const template = (
      <Circle lineWidth={8} startAngle={signal} end={0.5} />
    ) as Circle;
    const clone = template.clone({end: 0});

    expect(clone.lineWidth()).toBe(8);
    expect(clone.startAngle()).toBe(45);
    expect(clone.end()).toBe(0);
    expect(clone.startArrow.context.isInitial()).toBe(true);

    signal(90);

    expect(clone.startAngle()).toBe(90);
  });

  it('Reactive clone', () => {
    const signal = createSignal(45);
    const template = (
      <Circle lineWidth={8} startAngle={signal} end={0.5} />
    ) as Circle;
    const clone = template.reactiveClone({end: 0});

    expect(clone.lineWidth()).toBe(8);
    expect(clone.startAngle()).toBe(45);
    expect(clone.end()).toBe(0);
    expect(clone.startArrow.context.isInitial()).toBe(false);

    template.lineWidth(16);
    template.startArrow(true);
    template.end(0.25);
    signal(90);

    expect(clone.lineWidth()).toBe(16);
    expect(clone.startAngle()).toBe(90);
    expect(clone.startArrow()).toBe(true);
    expect(clone.end()).toBe(0);
  });

  it('Snapshot clone', () => {
    const signal = createSignal(45);
    const template = (
      <Circle lineWidth={8} startAngle={signal} end={0.5} />
    ) as Circle;
    const clone = template.snapshotClone({end: 0});

    expect(clone.lineWidth()).toBe(8);
    expect(clone.startAngle()).toBe(45);
    expect(clone.end()).toBe(0);
    expect(clone.startArrow.context.isInitial()).toBe(true);

    template.lineWidth(16);
    template.startArrow(true);
    signal(90);

    expect(clone.lineWidth()).toBe(8);
    expect(clone.startAngle()).toBe(45);
    expect(clone.startArrow()).toBe(false);
  });

  it('Clone compound signal', () => {
    const signal = Vector2.createSignal(200);
    const template = (<Circle offset={1} position={signal} />) as Circle;
    const clone = template.clone({x: 100, offsetY: -1});

    expect(clone.x()).toBe(100);
    expect(clone.y()).toBe(200);
    expect(clone.offset.x()).toBe(1);
    expect(clone.offset.y()).toBe(-1);

    signal([300, 400]);

    expect(clone.x()).toBe(100);
    expect(clone.y()).toBe(400);
  });

  it('Clone children', () => {
    const signal = createSignal(45);
    const template = (
      <Node>
        <Circle lineWidth={8} startAngle={signal} />
      </Node>
    );
    const clone = template.clone();

    expect(clone.children().length).toBe(1);
    expect(clone.childAs(0)).not.toBe(template.childAs(0));
    expect(clone.childAs<Circle>(0)!.lineWidth()).toBe(8);
    expect(clone.childAs<Circle>(0)!.startAngle()).toBe(45);

    signal(90);

    expect(clone.childAs<Circle>(0)!.startAngle()).toBe(90);
  });

  it('Clone spawner', () => {
    const count = createSignal(3);
    const template = (
      <Node>
        {() =>
          range(count()).map(() => (
            <Circle lineWidth={8} startAngle={count} end={0.5} />
          ))
        }
      </Node>
    );
    const clone = template.clone();

    expect(clone.children().length).toBe(3);
    expect(clone.childAs(0)).not.toBe(template.childAs(0));

    count(5);

    expect(clone.children().length).toBe(5);
  });
});
