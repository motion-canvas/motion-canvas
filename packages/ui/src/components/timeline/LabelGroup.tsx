import type {Scene} from '@motion-canvas/core';
import {useTimelineContext} from '../../contexts';
import {useSubscribableValue} from '../../hooks';
import {Label} from './Label';

interface LabelGroupProps {
  scene: Scene;
}

export function LabelGroup({scene}: LabelGroupProps) {
  const {firstVisibleFrame, lastVisibleFrame} = useTimelineContext();
  const events = useSubscribableValue(scene.timeEvents.onChanged);
  const cached = useSubscribableValue(scene.onCacheChanged);
  const isVisible =
    cached.lastFrame >= firstVisibleFrame &&
    cached.firstFrame <= lastVisibleFrame;

  return (
    <>
      {isVisible &&
        events.map(event => (
          <Label key={event.name} event={event} scene={scene} />
        ))}
    </>
  );
}
