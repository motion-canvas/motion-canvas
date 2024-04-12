import {CODE, Code, lines, makeScene2D, word} from '@motion-canvas/2d';
import {
  DEFAULT,
  SimpleSignal,
  createRef,
  createSignal,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const codeRef = createRef<Code>();

  const radius = createSignal(1);
  const r2 = createSignal(() => radius() * radius());
  const area = createSignal(() => Math.PI * r2());

  const functionName = Code.createSignal('calculateArea');

  const displayFloat = (signal: SimpleSignal<number, void>) => {
    return () => signal().toFixed(2).toString();
  };

  view.add(
    <Code
      fontSize={42}
      ref={codeRef}
      code={CODE`\
const radius = ${displayFloat(radius)};
area = ${functionName}(radius); // ${displayFloat(area)}

const ${functionName} = () => {
  const r2 = radius * radius; // ${displayFloat(radius)} * ${displayFloat(
    radius,
  )} = ${displayFloat(r2)}
  return Math.PI * r2;
};
    `}
    />,
  );

  yield* waitFor(2);
  yield* codeRef().selection(codeRef().findAllRanges(/radius/gi), 0.8);
  yield* waitFor(1);
  yield* codeRef().selection(DEFAULT, 0.8);
  yield* functionName('getAreaFromRadius', 1);
  yield* waitFor(2);
  yield* radius(10, 3, easeOutCubic);
  yield* waitFor(2);
  yield* codeRef().code.replace(
    lines(4, 5),
    CODE`  return Math.PI * radius * radius;\n`,
    1,
  );
  yield* waitFor(1);
  yield* codeRef().code.remove(word(4, 1, 7), 1);
  yield* waitFor(2);
});
