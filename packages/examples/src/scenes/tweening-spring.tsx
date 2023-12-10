import {Circle, makeScene2D} from '@motion-canvas/2d';
import {PlopSpring, SmoothSpring, createRef, spring} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const circle = createRef<Circle>();

  view.add(
    <Circle
      // highlight-start
      ref={circle}
      x={-400}
      size={240}
      fill={'#e13238'}
    />,
  );

  yield* spring(PlopSpring, -400, 400, 1, value => {
    circle().position.x(value);
  });
  yield* spring(SmoothSpring, 400, -400, value => {
    circle().position.x(value);
  });
});
