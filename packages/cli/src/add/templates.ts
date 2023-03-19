export function projectTemplate(): string {
  return `import {makeProject} from '@motion-canvas/core';

export default makeProject({
  scenes: [
                    
  ],
});`;
}

export function sceneTemplate(): string {
  return `import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {waitFor} from '@motion-canvas/core/lib/flow';
      
export default makeScene2D(function* (view) {
  // Create your animations here
    
  yield* waitFor(5);
});`;
}
