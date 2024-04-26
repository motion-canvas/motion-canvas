import {Rect, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInExpo,
  waitFor,
  waitUntil,
} from '@motion-canvas/core';

import {createCubicBezier} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();

  view.add(
    <Rect ref={rect} size={320} radius={80} smoothCorners fill={'#f3303f'} />,
  );

  yield* waitUntil('rect');
  yield* rect()
    .scale(2, 3, createCubicBezier(0.25, -1.04, 0, 2))
    .to(1, 0.6, easeInExpo);
  rect().fill('#ffa56d');
  yield* all(rect().ripple(1));
  yield* waitFor(0.3);
});
