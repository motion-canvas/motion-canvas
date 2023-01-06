import {Project} from '@motion-canvas/core/lib';

import scene from './scenes/random?scene';
import {Vector2} from '@motion-canvas/core/lib/types';

export default new Project({
  scenes: [scene],
  background: '#141414',
  size: new Vector2(960, 540),
});
