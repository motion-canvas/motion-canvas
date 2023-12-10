import {makeScene2D} from '@motion-canvas/2d';
import {
  CodeBlock,
  edit,
  insert,
  lines,
  remove,
} from '@motion-canvas/2d/lib/components/CodeBlock';
import {all, createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const codeRef = createRef<CodeBlock>();

  yield view.add(<CodeBlock ref={codeRef} code={`var myBool;`} />);

  yield* codeRef().edit(1.2, false)`var myBool${insert(' = true')};`;
  yield* waitFor(0.6);
  yield* codeRef().edit(1.2)`var myBool = ${edit('true', 'false')};`;
  yield* waitFor(0.6);
  yield* all(
    codeRef().selection(lines(0, Infinity), 1.2),
    codeRef().edit(1.2, false)`var my${edit('Bool', 'Number')} = ${edit(
      'false',
      '42',
    )};`,
  );
  yield* waitFor(0.6);
  yield* codeRef().edit(1.2, false)`var myNumber${remove(' = 42')};`;
  yield* waitFor(0.6);
  yield* codeRef().edit(1.2, false)`var my${edit('Number', 'Bool')};`;
  yield* waitFor(0.6);
});
