import {Circle, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInCubic, easeOutCubic} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const ref = createRef<Circle>();
  view.add(
    <Circle
      ref={ref}
      size={160}
      stroke={'lightseagreen'}
      lineWidth={8}
      endAngle={270}
      endArrow
    />,
  );

  yield* all(ref().start(1, 1), ref().rotation(180, 1, easeInCubic));
  ref().start(0).end(0);
  yield* all(ref().end(1, 1), ref().rotation(360, 1, easeOutCubic));
});
