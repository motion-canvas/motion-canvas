import {Project} from '@motion-canvas/core/lib';

import node from './scenes/positioning?scene';
import {Vector2} from '@motion-canvas/core/lib/types';

export default new Project({
  scenes: [node],
  size: new Vector2(960, 540),
  background: '#141414',
});
