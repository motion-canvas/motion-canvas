import '@motion-canvas/core/lib/patches';
import {bootstrap} from '@motion-canvas/core/lib/bootstrap';

import example from './scenes/example.scene';

bootstrap({
  name: 'base-project',
  scenes: [example],
});
