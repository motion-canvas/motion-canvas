import type {Scene} from '@motion-canvas/core/Scene';
import {useEffect, useState} from 'preact/hooks';
import {Label} from './Label';

interface LabelGroupProps {
  scene: Scene;
}

export function LabelGroup({scene}: LabelGroupProps) {
  const [events, setEvents] = useState(scene.timeEvents);

  useEffect(() => {
    setEvents(scene.timeEvents);
    scene.TimeEventsChanged.subscribe(setEvents);
    return () => scene.TimeEventsChanged.unsubscribe(setEvents);
  }, [scene]);

  return (
    <>
      {events.map(event => (
        <Label key={event.name} event={event} scene={scene} />
      ))}
    </>
  );
}
