// snippet Quadratic Bezier
import {QuadBezier, makeScene2D} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const bezier = createRef<QuadBezier>();

  view.add(
    <QuadBezier
      ref={bezier}
      lineWidth={6}
      stroke={'lightseagreen'}
      p0={[-200, 70]}
      p1={[0, -200]}
      p2={[200, 70]}
    />,
  );

  yield* bezier().start(1, 1);
  yield* bezier().start(0).end(0).end(1, 1);
});
