import {Project} from '@motion-canvas/core/lib';

import example from './scenes/example.scene';

export default new Project({
  name: 'project',
  scenes: [example],
  background: '#141414',
});
