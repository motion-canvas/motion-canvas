import {createRef, createRefArray} from '@motion-canvas/core';
import {describe, expect, it} from 'vitest';
import {useScene2D} from '../../scenes';
import {is} from '../../utils';
import {Circle} from '../Circle';
import {Rect} from '../Rect';
import {mockScene2D} from './mockScene2D';

describe('query', () => {
  mockScene2D();

  it('Query items based on their type', () => {
    const view = useScene2D().getView();
    const circles = createRefArray<Circle>();
    view.add(
      <>
        <Rect />
        <Circle ref={circles} />
        <Rect />
        <Circle ref={circles} />
        <Rect />
      </>,
    );

    const query = view.findAll(is(Circle));
    expect(query.length).toBe(2);
    expect(query).toEqual([...circles]);
  });

  it('Query items based on a custom predicate', () => {
    const view = useScene2D().getView();
    const nodes = createRefArray<Node>();
    view.add(
      <>
        <Rect ref={nodes} scale={2} />
        <Rect />
        <Circle />
        <Circle ref={nodes} scale={2} />
      </>,
    );

    const query = view.findAll(node => node.scale.x() === 2);
    expect(query.length).toBe(2);
    expect(query).toEqual([...nodes]);
  });

  it('Query the first matching child', () => {
    const view = useScene2D().getView();
    const match = createRef<Circle>();
    view.add(
      <>
        <Rect />
        <Rect>
          <Rect />
          <Circle ref={match} />
        </Rect>
        <Circle />
        <Rect />
      </>,
    );

    const query = view.findFirst(is(Circle));
    expect(query).toBe(match());
  });

  it('Query the last matching child', () => {
    const view = useScene2D().getView();
    const match = createRef<Circle>();
    view.add(
      <>
        <Rect />
        <Circle />
        <Circle>
          <Circle />
          <Rect />
          <Circle ref={match} />
        </Circle>
        <Rect />
      </>,
    );

    const query = view.findLast(is(Circle));
    expect(query?.key).toBe(match().key);
  });

  it('Query the first matching ancestor', () => {
    const view = useScene2D().getView();
    const child = createRef<Circle>();
    const match = createRef<Circle>();
    view.add(
      <Circle>
        <Circle ref={match}>
          <Rect>
            <Circle />
            <Circle ref={child} />
            <Circle />
          </Rect>
        </Circle>
      </Circle>,
    );

    const query = child().findAncestor(is(Circle));
    expect(query).toBe(match());
  });

  it('Retrieve a node by its key', () => {
    const view = useScene2D().getView();
    const match = createRef<Circle>();
    view.add(
      <>
        <Circle>
          <Rect />
          <Circle ref={match} key="test-key" />
        </Circle>
        <Rect />
      </>,
    );

    const query = view.findKey('test-key');
    expect(query).toBe(match());
  });
});
