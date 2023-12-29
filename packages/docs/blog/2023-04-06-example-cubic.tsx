// snippet Cubic Bezier
import {CubicBezier, makeScene2D} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const bezier = createRef<CubicBezier>();

  view.add(
    <CubicBezier
      ref={bezier}
      lineWidth={6}
      stroke={'lightseagreen'}
      p0={[-200, 0]}
      p1={[50, -200]}
      p2={[-50, 200]}
      p3={[200, 0]}
    />,
  );

  yield* bezier().start(1, 1);
  yield* bezier().start(0).end(0).end(1, 1);
});
