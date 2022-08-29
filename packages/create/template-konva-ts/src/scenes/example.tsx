import {makeKonvaScene} from '@motion-canvas/legacy/lib/scenes';
import {waitFor} from '@motion-canvas/core/lib/flow';

export default makeKonvaScene(function* (view) {
  // Create your animations here

  yield* waitFor(5);
});
