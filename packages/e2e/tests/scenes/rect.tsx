import {makeScene2D, Rect} from '@motion-canvas/2d';

export default makeScene2D(function* (view) {
  view.add(
    <Rect
      width={300}
      height={200}
      fill={'#0008'}
      radius={[0, 100, 30, 200]}
      start={0.35}
    />,
  );
  yield;
});
