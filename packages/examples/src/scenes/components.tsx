import {makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';
import {Switch} from '@motion-canvas/examples/src/components/Switch';
// see this import for the component ^

// usage of the component:
export default makeScene2D(function* (view) {
  const switchRef = createRef<Switch>();

  view.add(<Switch ref={switchRef} initialState={true} />);

  yield* switchRef().toggle(0.6);
  yield* waitFor(1);
  yield* switchRef().toggle(0.6);
  yield* waitFor(1);
});
