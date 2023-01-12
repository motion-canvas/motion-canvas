import {makeProject} from '@motion-canvas/core';

import scene from './scenes/random?scene';
import {Vector2} from '@motion-canvas/core/lib/types';

export default makeProject({
  scenes: [scene],
  background: '#141414',
  size: new Vector2(960, 540),
});
