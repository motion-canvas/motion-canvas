import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {chain, loop, waitFor} from '@motion-canvas/core/lib/flow';
import {createRef} from '@motion-canvas/core/lib/utils';
import {Switch} from '@motion-canvas/examples/src/scenes/components-switch';
// see this import for the component ^

// usage of the component:
export default makeScene2D(function* (view) {
  const switchRef = createRef<Switch>();

  view.add(<Switch ref={switchRef} initialState={true} />);

  yield* switchRef().toggle(0.2);
  yield* waitFor(1);
  yield* switchRef().toggle(0.2);
  yield* waitFor(1);
});
