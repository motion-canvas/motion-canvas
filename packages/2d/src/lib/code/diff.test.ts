import {expect, test} from 'vitest';
import {patienceDiff} from './diff';

test('should find simple strings', () => {
  const result = patienceDiff(
    ['abc', 'def', 'ghi'],
    ['abc', 'def', 'ghi', 'jkl'],
  );

  // printDiff(result);
  /*
      abc
      def
      ghi
    + jkl
  */

  expect(result).toMatchObject({
    lines: [
      // We don't care too much about the first three line results
      {},
      {},
      {},
      {
        line: 'jkl',
        // We care that we know that this line was not there.
        aIndex: -1,
        bIndex: 3,
      },
    ],
  });
});

test('should diff code effectively', () => {
  const result = patienceDiff(
    `function test() {
  console.log('hello world');
}`.split('\n'),
    `function test() {
  console.log('hello world');
}

function other() {
  return 5;
}`.split('\n'),
  );

  // printDiff(result);
  /*
      function test() {
        console.log('hello world');
      }
    + 
    + function other() {
    +   return 5;
    + }
  */

  expect(result).toMatchObject({
    lines: [
      {
        line: 'function test() {',
      },
      {
        line: "  console.log('hello world');",
      },
      {
        line: '}',
      },
      {
        line: '',
      },
      {
        line: 'function other() {',
        // Make sure this line was added
        aIndex: -1,
      },
      {
        line: '  return 5;',
        aIndex: -1,
      },
      {
        line: '}',
        aIndex: -1,
      },
    ],
  });
});

test('should diff code movement effectively', () => {
  const result = patienceDiff(
    `function test() {
  console.log('hello world');
}

function other() {
  return 5;
}`.split('\n'),
    `function other() {
  return 5;
}

function test() {
  console.log('hello world');
}`.split('\n'),
  );

  // printDiff(result);
  /*
    - function test() {
    -   console.log('hello world');
    - }
    - 
      function other() {
        return 5;
      }
    + 
    + function test() {
    +   console.log('hello world');
    + }
  */

  expect(result).toMatchObject({
    lines: [
      {
        line: 'function test() {',
        // Make sure this line was removed
        bIndex: -1,
      },
      {
        line: "  console.log('hello world');",
        bIndex: -1,
      },
      {
        line: '}',
        bIndex: -1,
      },
      {
        line: '',
        bIndex: -1,
      },
      {
        line: 'function other() {',
      },
      {
        line: '  return 5;',
      },
      {
        line: '}',
      },
      {
        line: '',
        aIndex: -1,
      },
      {
        line: 'function test() {',
        // Make sure this line was added
        aIndex: -1,
      },
      {
        line: "  console.log('hello world');",
        aIndex: -1,
      },
      {
        line: '}',
        aIndex: -1,
      },
    ],
  });
});

test('should diff complex code movement effectively', () => {
  const result = patienceDiff(
    `void Chunk_copy(Chunk *src, size_t src_start, Chunk *dst, size_t dst_start, size_t n)
{
    if (!Chunk_bounds_check(src, src_start, n)) return;
    if (!Chunk_bounds_check(dst, dst_start, n)) return;

    memcpy(dst->data + dst_start, src->data + src_start, n);
}

int Chunk_bounds_check(Chunk *chunk, size_t start, size_t n)
{
    if (chunk == NULL) return 0;

    return start <= chunk->length && n <= chunk->length - start;
}`.split('\n'),
    `int Chunk_bounds_check(Chunk *chunk, size_t start, size_t n)
{
    if (chunk == NULL) return 0;

    return start <= chunk->length && n <= chunk->length - start;
}

void Chunk_copy(Chunk *src, size_t src_start, Chunk *dst, size_t dst_start, size_t n)
{
    if (!Chunk_bounds_check(src, src_start, n)) return;
    if (!Chunk_bounds_check(dst, dst_start, n)) return;

    memcpy(dst->data + dst_start, src->data + src_start, n);
}`.split('\n'),
  );

  // printDiff(result);
  /* 
    + int Chunk_bounds_check(Chunk *chunk, size_t start, size_t n)
    + {
    +     if (chunk == NULL) return 0;
    + 
    +     return start <= chunk->length && n <= chunk->length - start;
    + }
    + 
      void Chunk_copy(Chunk *src, size_t src_start, Chunk *dst, size_t dst_start, size_t n)
      {
          if (!Chunk_bounds_check(src, src_start, n)) return;
          if (!Chunk_bounds_check(dst, dst_start, n)) return;
      
          memcpy(dst->data + dst_start, src->data + src_start, n);
      }
    -
    - int Chunk_bounds_check(Chunk *chunk, size_t start, size_t n)
    - {
    -     if (chunk == NULL) return 0;
    -
    -     return start <= chunk->length && n <= chunk->length - start;
    - }
  */

  expect(result).toMatchObject({
    lines: [
      {
        line: 'int Chunk_bounds_check(Chunk *chunk, size_t start, size_t n)',
        // Make sure this is the line added
        aIndex: -1,
      },
      {
        line: '{',
        aIndex: -1,
      },
      {
        line: '    if (chunk == NULL) return 0;',
        aIndex: -1,
      },
      {
        line: '',
        aIndex: -1,
      },
      {
        line: '    return start <= chunk->length && n <= chunk->length - start;',
        aIndex: -1,
      },
      {
        line: '}',
        aIndex: -1,
      },
      {
        line: '',
      },
      {
        line: 'void Chunk_copy(Chunk *src, size_t src_start, Chunk *dst, size_t dst_start, size_t n)',
      },
      {
        line: '{',
      },
      {
        line: '    if (!Chunk_bounds_check(src, src_start, n)) return;',
      },
      {
        line: '    if (!Chunk_bounds_check(dst, dst_start, n)) return;',
      },
      {
        line: '',
      },
      {
        line: '    memcpy(dst->data + dst_start, src->data + src_start, n);',
      },
      {
        line: '}',
      },
      {
        line: '',
        bIndex: -1,
      },
      {
        line: 'int Chunk_bounds_check(Chunk *chunk, size_t start, size_t n)',
        // Make sure this is the line removed
        bIndex: -1,
      },
      {
        line: '{',
        bIndex: -1,
      },
      {
        line: '    if (chunk == NULL) return 0;',
        bIndex: -1,
      },
      {
        line: '',
        bIndex: -1,
      },
      {
        line: '    return start <= chunk->length && n <= chunk->length - start;',
        bIndex: -1,
      },
      {
        line: '}',
        bIndex: -1,
      },
    ],
  });
});
