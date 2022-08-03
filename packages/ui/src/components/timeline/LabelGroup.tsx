import type {Scene} from '@motion-canvas/core/lib/scenes';
import {Label} from './Label';
import {useSubscribableValue} from '../../hooks';
import {useContext} from 'preact/hooks';
import {TimelineContext} from './TimelineContext';

interface LabelGroupProps {
  scene: Scene;
}

export function LabelGroup({scene}: LabelGroupProps) {
  const {startFrame, endFrame} = useContext(TimelineContext);
  const events = useSubscribableValue(scene.timeEvents.onChanged);
  const cached = useSubscribableValue(scene.onCacheChanged);
  const isVisible =
    cached.lastFrame >= startFrame && cached.firstFrame <= endFrame;

  return (
    <>
      {isVisible &&
        events.map(event => (
          <Label key={event.name} event={event} scene={scene} />
        ))}
    </>
  );
}
