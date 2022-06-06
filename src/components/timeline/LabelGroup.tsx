import type {Scene} from '@motion-canvas/core/Scene';
import {Label} from './Label';
import {useEventState} from '../../hooks';

interface LabelGroupProps {
  scene: Scene;
}

export function LabelGroup({scene}: LabelGroupProps) {
  const events = useEventState(scene.TimeEventsChanged, () => scene.timeEvents);

  return (
    <>
      {events.map(event => (
        <Label key={event.name} event={event} scene={scene} />
      ))}
    </>
  );
}
