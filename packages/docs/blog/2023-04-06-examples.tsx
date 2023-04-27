// snippet Cubic Bezier
import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {CubicBezier} from '@motion-canvas/2d/lib/components';
import {createRef} from '@motion-canvas/core/lib/utils';

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

// snippet Quadratic Bezier
import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {QuadBezier} from '@motion-canvas/2d/lib/components';
import {createRef} from '@motion-canvas/core/lib/utils';

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
