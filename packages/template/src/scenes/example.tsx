import {Rect, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createCubicBezier,
  createRef,
  easeInExpo,
  waitFor,
  waitUntil,
} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();

  view.add(
    <Rect ref={rect} size={320} radius={80} smoothCorners fill={'#f3303f'} />,
  );

  // https://www.desmos.com/calculator/ep6s3nrev8
  const bezier = createCubicBezier(0.42, 0, 0.58, 1);
  yield* waitUntil('rect');
  yield* rect().scale(2, 1, bezier).to(1, 0.6, easeInExpo);
  rect().fill('#ffa56d');
  yield* all(rect().ripple(1));
  yield* waitFor(0.3);
});
