import type {Scene} from '@motion-canvas/core';
import {useEffect, useState} from 'preact/hooks';
import {useApplication} from '../../contexts';
import {useSubscribableValue} from '../../hooks';
import {ControlledExpandable} from '../fields';
import {SlideElement} from './SlideElement';

interface SceneGroupProps {
  scene: Scene;
}

export function SceneGroup({scene}: SceneGroupProps) {
  const {presenter} = useApplication();
  const {currentSlideId, nextSlideId, isWaiting} = useSubscribableValue(
    presenter.onInfoChanged,
  );
  const slides = useSubscribableValue(scene.slides.onChanged);
  const [open, setOpen] = useState(
    !!slides.find(({id}) => id === currentSlideId),
  );

  useEffect(() => {
    if (
      slides.find(
        ({id}) => id === currentSlideId || (!isWaiting && id === nextSlideId),
      )
    ) {
      setOpen(true);
    }
  }, [currentSlideId, nextSlideId, isWaiting]);

  return slides.length > 0 ? (
    <ControlledExpandable open={open} setOpen={setOpen} title={scene.name}>
      {slides.map(slide => (
        <SlideElement
          key={slide.id}
          slide={slide}
          active={currentSlideId === slide.id}
          inProgress={!isWaiting && nextSlideId === slide.id}
        />
      ))}
    </ControlledExpandable>
  ) : (
    <></>
  );
}
