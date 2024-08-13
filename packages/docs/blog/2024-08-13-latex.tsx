import {Latex, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const tex = createRef<Latex>();
  view.add(<Latex ref={tex} tex="{{y=}}{{a}}{{x^2}}" fill="white" />);

  yield* waitFor(0.2);
  yield* tex().tex('{{y=}}{{a}}{{x^2}} + {{bx}}', 1);
  yield* waitFor(0.2);
  yield* tex().tex(
    '{{y=}}{{\\left(}}{{a}}{{x^2}} + {{bx}}{{\\over 1}}{{\\right)}}',
    1,
  );
  yield* waitFor(0.2);
  yield* tex().tex('{{y=}}{{a}}{{x^2}}', 1);
});
