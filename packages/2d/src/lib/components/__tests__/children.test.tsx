import {createRef, createSignal, range} from '@motion-canvas/core';
import {describe, expect, it} from 'vitest';
import {useScene2D} from '../../scenes';
import {Node} from '../Node';
import {mockScene2D} from './mockScene2D';

describe('children', () => {
  mockScene2D();

  it('Append children', () => {
    const view = useScene2D().getView();
    const parent = createRef<Node>();
    const childA = createRef<Node>();
    const childB = createRef<Node>();

    view.add(
      <Node ref={parent}>
        <Node ref={childA} />
        <Node ref={childB} />
      </Node>,
    );

    expect(childA().parent()).toBe(parent());
    expect(childB().parent()).toBe(parent());
    expect(parent().children()).toEqual([childA(), childB()]);
  });

  it('Clear children', () => {
    const view = useScene2D().getView();
    const parent = createRef<Node>();
    const childA = createRef<Node>();
    const childB = createRef<Node>();

    view.add(
      <Node ref={parent}>
        <Node ref={childA} />
        <Node ref={childB} />
      </Node>,
    );

    parent().removeChildren();

    expect(childA().parent()).toBe(null);
    expect(childB().parent()).toBe(null);
    expect(parent().children()).toEqual([]);
  });

  it('Replace children', () => {
    const view = useScene2D().getView();
    const parent = createRef<Node>();
    const childA = <Node />;
    const childB = <Node />;

    view.add(<Node ref={parent}>{childA}</Node>);

    parent().children(childB);

    expect(childA.parent()).toBe(null);
    expect(childB.parent()).toBe(parent());
    expect(parent().children()).toEqual([childB]);
  });

  it('Take a child from another node', () => {
    const view = useScene2D().getView();
    const parentA = createRef<Node>();
    const parentB = createRef<Node>();
    const child = createRef<Node>();

    view.add(
      <>
        <Node ref={parentA}>
          <Node ref={child} />
        </Node>
        <Node ref={parentB} />
      </>,
    );

    expect(parentA().children()).toEqual([child()]);
    expect(parentB().children()).toEqual([]);
    expect(child().parent()).toBe(parentA());

    parentB().children(child());

    expect(parentA().children()).toEqual([]);
    expect(parentB().children()).toEqual([child()]);
    expect(child().parent()).toBe(parentB());
  });

  it('Append children conditionally', () => {
    const view = useScene2D().getView();
    const parent = createRef<Node>();
    const childA = <Node />;
    const childB = <Node />;
    const predicate = createSignal(false);

    view.add(<Node ref={parent}>{() => (predicate() ? childA : childB)}</Node>);

    expect(parent().children()).toEqual([childB]);
    expect(childA.parent()).toBe(null);
    expect(childB.parent()).toBe(parent());

    predicate(true);

    expect(parent().children()).toEqual([childA]);
    expect(childA.parent()).toBe(parent());
    expect(childB.parent()).toBe(null);
  });

  it('Spawn reactive children', () => {
    const view = useScene2D().getView();
    const parent = createRef<Node>();
    const count = createSignal(3);

    view.add(
      <Node ref={parent}>{() => range(count()).map(() => <Node />)}</Node>,
    );

    expect(parent().children().length).toBe(3);

    count(5);

    expect(parent().children().length).toBe(5);
  });

  it('Replace a spawner', () => {
    const view = useScene2D().getView();
    const parent = createRef<Node>();
    const childA = <Node />;
    const childB = <Node />;

    view.add(<Node ref={parent}>{() => childA}</Node>);

    expect(parent().children()).toEqual([childA]);
    expect(childA.parent()).toBe(parent());

    parent().children(childB);

    expect(childA.parent()).toBe(null);
    expect(childB.parent()).toBe(parent());
    expect(parent().children()).toEqual([childB]);
  });
});
