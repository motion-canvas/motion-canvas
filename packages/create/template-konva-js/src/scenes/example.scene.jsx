import {makeKonvaScene} from '@motion-canvas/core/lib/scenes';
import {waitFor} from '@motion-canvas/core/lib/flow';

export default makeKonvaScene(function* example(view) {
  // Create your animations here

  yield* waitFor(5);
});
