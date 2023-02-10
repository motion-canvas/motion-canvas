import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Video} from '@motion-canvas/2d/lib/components';
import {createRef} from '@motion-canvas/core/lib/utils';

import exampleMp4 from '@motion-canvas/examples/assets/example.mp4';

export default makeScene2D(function* (view) {
  const videoRef = createRef<Video>();

  view.add(<Video ref={videoRef} src={exampleMp4} />);

  videoRef().play();
  yield* videoRef().scale(1.25, 2).to(1, 2);
});
