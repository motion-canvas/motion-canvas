import {linear, waitFor} from '@motion-canvas/core';
import {describe, expect, it, vi} from 'vitest';
import {Txt} from './Txt';
import {TxtLeaf} from './TxtLeaf';
import {generatorTest} from './__tests__/generatorTest';
import {mockScene2D} from './__tests__/mockScene2D';

describe('Txt', () => {
  mockScene2D();

  it('Handle plain text', () => {
    const node = (<Txt lineWidth={8}>test</Txt>) as Txt;

    const parseSpy = vi.spyOn(node as any, 'parseChildren');
    const leaf = node.childAs<TxtLeaf>(0);

    expect(node.text()).toBe('test');
    expect(node.lineWidth()).toBe(8);
    expect(node.children().length).toBe(1);
    expect(leaf).toBeInstanceOf(TxtLeaf);
    expect(leaf!.text()).toBe('test');
    expect(leaf!.lineWidth()).toBe(8);

    node.lineWidth(16);
    node.text('changed');

    expect(node.childAs(0)).toBe(leaf);
    expect(leaf!.lineWidth()).toBe(16);
    expect(leaf!.text()).toBe('changed');

    // Parsing should not happen when operating exclusively on simple text
    expect(parseSpy).toHaveBeenCalledTimes(0);
  });

  it('Handle complex text', () => {
    const node = (
      <Txt lineWidth={8}>
        Apple <Txt>Banana</Txt> Cherry
      </Txt>
    ) as Txt;

    const first = node.childAs<TxtLeaf>(0);
    const second = node.childAs<Txt>(1);
    const third = node.childAs<TxtLeaf>(2);

    expect(node.text()).toBe('Apple Banana Cherry');
    expect(node.lineWidth()).toBe(8);
    expect(node.children().length).toBe(3);
    expect(first).toBeInstanceOf(TxtLeaf);
    expect(first!.text()).toBe('Apple ');
    expect(first!.lineWidth()).toBe(8);

    expect(second).toBeInstanceOf(Txt);
    expect(second!.text()).toBe('Banana');
    expect(second!.lineWidth()).toBe(8);

    expect(third).toBeInstanceOf(TxtLeaf);
    expect(third!.text()).toBe(' Cherry');
    expect(third!.lineWidth()).toBe(8);
  });

  it(
    'Tween complex to simple text',
    generatorTest(function* () {
      const node = (
        <Txt>
          <Txt>Apple</Txt> Banana
        </Txt>
      ) as Txt;

      yield node.text('Simple', 2, linear);
      yield* waitFor(1);

      const leaf = node.childAs<TxtLeaf>(0)!;

      expect(node.children().length).toBe(1);
      expect(node.text()).toBe('Apple Ban');
      expect(leaf.text()).toBe('Apple Ban');
    }),
  );
});
