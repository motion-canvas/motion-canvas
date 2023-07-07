import {describe, expect, it} from 'vitest';
import {applyTransformDiff, getTransformDiff} from './diff';

describe('diff', () => {
  it('Insert single item', () => {
    const from = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '3',
      },
    ];
    const to = [
      {
        id: '1',
      },
      {
        id: '4',
      },
      {
        id: '2',
      },
      {
        id: '3',
      },
    ];
    const diff = getTransformDiff(from, to);
    applyTransformDiff(from, diff, ({id}) => ({id}));
    expect(from).toEqual(to);
  });

  it('Insert single item when contain have two item with equal', () => {
    const from = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '1',
      },
      {
        id: '3',
      },
      {
        id: '1',
      },
    ];
    const to = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '1',
      },
      {
        id: '4',
      },
      {
        id: '3',
      },
      {
        id: '1',
      },
    ];
    const diff = getTransformDiff(from, to);
    applyTransformDiff(from, diff, ({id}) => ({id}));
    expect(from).toEqual(to);
  });
  it('Insert multiple item', () => {
    const from = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '1',
      },
      {
        id: '3',
      },
      {
        id: '1',
      },
    ];
    const to = [
      {
        id: '1',
      },
      {
        id: '7',
      },
      {
        id: '2',
      },
      {
        id: '1',
      },
      {
        id: '4',
      },
      {
        id: '3',
      },
      {
        id: '1',
      },
      {
        id: '9',
      },
    ];
    const diff = getTransformDiff(from, to);
    applyTransformDiff(from, diff, ({id}) => ({id}));
    expect(from).toEqual(to);
  });
  it('Insert single item with equal id', () => {
    const from = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '3',
      },
    ];
    const to = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '1',
      },
      {
        id: '3',
      },
    ];
    const diff = getTransformDiff(from, to);
    expect(diff.inserted).toEqual([]);
    applyTransformDiff(from, diff, ({id}) => ({id}));
    expect(from).toEqual(to);
  });
  it('Insert multiple item with equal id', () => {
    const from = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '3',
      },
    ];
    const to = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '1',
      },
      {
        id: '3',
      },
      {
        id: '1',
      },
      {
        id: '1',
      },
    ];
    const diff = getTransformDiff(from, to);
    expect(diff.inserted).toEqual([]);
    applyTransformDiff(from, diff, ({id}) => ({id}));
    expect(from).toEqual(to);
  });
  it('Delete single item', () => {
    const from = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '3',
      },
    ];
    const to = [
      {
        id: '1',
      },
      {
        id: '3',
      },
    ];
    const diff = getTransformDiff(from, to);
    expect(diff.deleted.map(({current}) => current)).toEqual([
      {
        id: '2',
      },
    ]);
  });
  it('Delete multiple item', () => {
    const from = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '3',
      },
    ];
    const to = [
      {
        id: '1',
      },
    ];
    const diff = getTransformDiff(from, to);
    expect(diff.deleted.map(({current}) => current)).toEqual([
      {
        id: '2',
      },
      {
        id: '3',
      },
    ]);
  });
  it('Delete single item with equal id', () => {
    const from = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '3',
      },
      {
        id: '1',
      },
    ];
    const to = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '3',
      },
    ];
    const diff = getTransformDiff(from, to);
    expect(diff.deleted).toEqual([]);
    expect(diff.transformed).toContainEqual({
      from: {
        before: {
          id: '3',
        },
        beforeIdIndex: 0,
        current: {
          id: '1',
        },
        currentIndex: 3,
      },
      insert: false,
      remove: true,
      to: {
        before: undefined,
        beforeIdIndex: -1,
        current: {
          id: '1',
        },
        currentIndex: 0,
      },
    });
  });
  it('Delete single item with equal id', () => {
    const from = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '1',
      },
      {
        id: '3',
      },
      {
        id: '1',
      },
    ];
    const to = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '3',
      },
    ];
    const diff = getTransformDiff(from, to);
    expect(diff.deleted).toEqual([]);
    expect(diff.transformed).toContainEqual({
      from: {
        before: {
          id: '2',
        },
        beforeIdIndex: 0,
        current: {
          id: '1',
        },
        currentIndex: 2,
      },
      insert: false,
      remove: true,
      to: {
        before: undefined,
        beforeIdIndex: -1,
        current: {
          id: '1',
        },
        currentIndex: 0,
      },
    });
    expect(diff.transformed).toContainEqual({
      from: {
        before: {
          id: '3',
        },
        beforeIdIndex: 0,
        current: {
          id: '1',
        },
        currentIndex: 4,
      },
      insert: false,
      remove: true,
      to: {
        before: undefined,
        beforeIdIndex: -1,
        current: {
          id: '1',
        },
        currentIndex: 0,
      },
    });
  });

  it('Insert single item with moving', () => {
    const from = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '3',
      },
    ];
    const to = [
      {
        id: '1',
      },
      {
        id: '3',
      },
      {
        id: '5',
      },
      {
        id: '2',
      },
    ];
    const diff = getTransformDiff(from, to);
    applyTransformDiff(from, diff, ({id}) => ({id}));
    expect(from).toEqual([
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '3',
      },
      {
        id: '5',
      },
    ]);
  });

  it('Insert item after transformed insert', () => {
    const from = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '3',
      },
    ];
    const to = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '1',
      },
      {
        id: '4',
      },
      {
        id: '3',
      },
    ];
    const diff = getTransformDiff(from, to);
    applyTransformDiff(from, diff, ({id}) => ({id}));
    expect(from).toEqual(to);
  });
});
