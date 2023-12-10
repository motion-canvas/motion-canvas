import {Layout, Rect, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  loop,
  makeRef,
  range,
  sequence,
  useRandom,
} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // highlight-next-line
  const random = useRandom();
  const rects: Rect[] = [];

  view.add(
    <Layout layout gap={10} alignItems="center">
      {range(40).map(i => (
        <Rect
          ref={makeRef(rects, i)}
          radius={5}
          width={10}
          height={10}
          fill={'#e13238'}
        />
      ))}
    </Layout>,
  );

  yield* loop(3, () =>
    sequence(
      0.04,
      ...rects.map(rect =>
        all(
          // highlight-next-line
          rect.size.y(random.nextInt(100, 200), 0.5).to(10, 0.5),
          rect.fill('#e6a700', 0.5).to('#e13238', 0.5),
        ),
      ),
    ),
  );
});
