import {Code, makeScene2D} from '@motion-canvas/2d';
import {DEFAULT, all, createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const code = createRef<Code>();

  view.add(
    <Code
      ref={code}
      fontSize={28}
      fontFamily={'JetBrains Mono, monospace'}
      offsetX={-1}
      x={-400}
      code={'const number = 7;'}
    />,
  );

  yield* waitFor(0.6);
  yield* all(
    code().code.replace(code().findFirstRange('number'), 'variable', 0.6),
    code().code.prepend(0.6)`function example() {\n  `,
    code().code.append(0.6)`\n}`,
  );

  yield* waitFor(0.6);
  yield* code().selection(code().findFirstRange('variable'), 0.6);

  yield* waitFor(0.6);
  yield* all(
    code().code('const number = 7;', 0.6),
    code().selection(DEFAULT, 0.6),
  );
});
