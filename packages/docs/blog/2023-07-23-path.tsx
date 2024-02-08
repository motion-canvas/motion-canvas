import {makeScene2D, Path} from '@motion-canvas/2d';

export default makeScene2D(function* (view) {
  view.add(
    <Path
      scale={8}
      position={-96}
      fill={'lightseagreen'}
      data={
        'M4 6.47L5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4z'
      }
    />,
  );
});
