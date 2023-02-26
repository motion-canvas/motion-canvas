import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Circle, Txt, Line} from '@motion-canvas/2d/lib/components';
import {createSignal} from '@motion-canvas/core/lib/signals';
import {Vector2} from '@motion-canvas/core/lib/types';
import {waitFor} from '@motion-canvas/core/lib/flow';

export default makeScene2D(function* (view) {
  // highlight-start
  const radius = createSignal(3);
  const area = createSignal(() => Math.PI * radius() * radius());
  // highlight-end

  const scale = 100;
  const textStyle = {
    fontWeight: 700,
    fontSize: 56,
    offsetY: -1,
    padding: 20,
    cache: true,
  };

  view.add(
    <>
      <Circle
        // highlight-start
        width={() => radius() * scale * 2}
        height={() => radius() * scale * 2}
        // highlight-end
        fill={'#e13238'}
      />
      <Line
        points={[
          Vector2.zero,
          // highlight-next-line
          () => Vector2.right.scale(radius() * scale),
        ]}
        lineDash={[20, 20]}
        startArrow
        endArrow
        endOffset={8}
        lineWidth={8}
        stroke={'#242424'}
      />
      <Txt
        // highlight-start
        text={() => `r = ${radius().toFixed(2)}`}
        x={() => (radius() * scale) / 2}
        // highlight-end
        fill={'#242424'}
        {...textStyle}
      />
      <Txt
        // highlight-start
        text={() => `A = ${area().toFixed(2)}`}
        y={() => radius() * scale}
        // highlight-end
        fill={'#e13238'}
        {...textStyle}
      />
    </>,
  );

  yield* radius(4, 2).to(3, 2);
  yield* waitFor(1);
});
