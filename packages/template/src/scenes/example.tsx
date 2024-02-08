import {makeScene2D, Circle} from '@motion-canvas/2d';
import {waitFor, waitUntil, createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const circle = createRef<Circle>();

  view.add(
    <Circle ref={circle} width={320} height={320} fill={'lightseagreen'} />,
  );

  yield* waitUntil('circle');
  yield* circle().scale(2, 2).to(1, 2);

  yield* waitFor(5);
});
