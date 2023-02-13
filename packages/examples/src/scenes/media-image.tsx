import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Image} from '@motion-canvas/2d/lib/components';
import {createRef} from '@motion-canvas/core/lib/utils';
import {all} from '@motion-canvas/core/lib/flow';

import logoSvg from '@motion-canvas/examples/assets/logo.svg';

export default makeScene2D(function* (view) {
  const imageRef = createRef<Image>();

  view.add(<Image ref={imageRef} src={logoSvg} scale={2} />);

  yield* all(
    imageRef().scale(2.5, 1.5).to(2, 1.5),
    imageRef().absoluteRotation(90, 1.5).to(0, 1.5),
  );
});
