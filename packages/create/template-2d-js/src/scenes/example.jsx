import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {waitFor} from '@motion-canvas/core/lib/flow';

export default makeScene2D(function* (view) {
  // Create your animations here

  yield* waitFor(5);
});
