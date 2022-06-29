import type {Scene} from '@motion-canvas/core/lib/Scene';
import {Label} from './Label';
import {useSubscribableValue} from '../../hooks';

interface LabelGroupProps {
  scene: Scene;
}

export function LabelGroup({scene}: LabelGroupProps) {
  const events = useSubscribableValue(scene.timeEvents.onChanged);

  return (
    <>
      {events.map(event => (
        <Label key={event.name} event={event} scene={scene} />
      ))}
    </>
  );
}
