import {makeProject} from '@motion-canvas/core';

import scene from './scenes/tex?scene';
import {Vector2} from '@motion-canvas/core/lib/types';

export default makeProject({
  scenes: [scene],
  size: new Vector2(960, 540),
});
