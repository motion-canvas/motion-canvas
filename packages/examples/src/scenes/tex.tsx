import {Latex} from '@motion-canvas/2d/lib/components';
import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {waitFor} from '@motion-canvas/core/lib/flow';
import {createRef} from '@motion-canvas/core/lib/utils';

export default makeScene2D(function* (view) {
  const tex = createRef<Latex>();
  view.add(<Latex ref={tex} tex={['y', '=', '{{a}}{{x^2}}']} fill="white" />);

  yield* waitFor(0.5);
  yield* tex().tex(['y', '=', '{{a}}{{x^2}} + {{bx}}'], 1);
  yield* waitFor(0.5);
  yield* tex().tex(['y', '=', '{{c}} + {{a}}{{x^2}} + {{bx}}'], 1);
  yield* waitFor(0.5);
  yield* tex().tex(['y', '=', '{{a}}{{x^2}} + {{bx}} + {{c}}'], 1);
  yield* waitFor(0.5);
  yield* tex().tex(['y', '=', '{{x^2}}'], 1);
  yield* waitFor(0.5);
  yield* tex().tex(['y', '=', '{{a}}{{x^2}}'], 1);
});
