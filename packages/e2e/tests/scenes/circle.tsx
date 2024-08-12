import {Circle, makeScene2D} from '@motion-canvas/2d';

export default makeScene2D(function* (view) {
  view.add(
    <Circle
      size={200}
      stroke={'blue'}
      lineWidth={40}
      arrowSize={40}
      fill={'lightseagreen'}
      strokeFirst={true}
      endArrow
      endAngle={-90}
      end={0.5}
      lineCap={'round'}
      cache
    />,
  );
  yield;
});
