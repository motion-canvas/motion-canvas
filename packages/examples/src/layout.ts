import {Project} from '@motion-canvas/core/lib';

import layout from './scenes/layout?scene';
import {Vector2} from '@motion-canvas/core/lib/types';

export default new Project({
  scenes: [layout],
  size: new Vector2(960, 540),
  background: '#141414',
});
