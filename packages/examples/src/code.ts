import {makeProject} from '@motion-canvas/core';
import scene from './scenes/code?scene';

import {parser} from '@lezer/javascript';
import {Code, LezerHighlighter} from '@motion-canvas/2d';

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [scene],
});
