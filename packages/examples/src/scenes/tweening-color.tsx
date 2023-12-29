import {Circle, makeScene2D} from '@motion-canvas/2d';
import {Color, createRef, easeInOutCubic, tween} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const circle = createRef<Circle>();

  view.add(
    <Circle
      //highlight-start
      ref={circle}
      width={240}
      height={240}
      fill="#e13238"
    />,
  );
  //highlight-start
  yield* tween(2, value => {
    circle().fill(
      Color.lerp(
        new Color('#e13238'),
        new Color('#e6a700'),
        easeInOutCubic(value),
      ),
    );
  });
  //highlight-end
});
