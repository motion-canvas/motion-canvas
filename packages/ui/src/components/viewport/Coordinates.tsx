import {useEffect, useState} from 'react';
import {useCallback, useContext} from 'preact/hooks';
import {
  useCurrentScene,
  useDocumentEvent,
  useSharedSettings,
} from '../../hooks';
import {ViewportContext} from './ViewportContext';
import {isInspectable} from '@motion-canvas/core';
import clsx from 'clsx';
import styles from '@motion-canvas/ui/src/components/controls/Controls.module.scss';

export function Coordinates() {
  const [mousePos, setMousePos] = useState({x: 0, y: 0});
  const [hover, setHover] = useState(true);

  const state = useContext(ViewportContext);
  const settings = {
    ...useSharedSettings(),
  };
  const scene = useCurrentScene();

  useEffect(() => {
    const handleMouseMove = (event: {x: number; y: number}) => {
      if (!isInspectable(scene)) return;
      const absoluteCoords = {
        x: event.x - state.size.x,
        y: event.y - state.size.y,
      };

      absoluteCoords.x -= state.x + state.width / 2;
      absoluteCoords.y -= state.y + state.height / 2;
      absoluteCoords.x /= state.zoom;
      absoluteCoords.y /= state.zoom;
      absoluteCoords.x += settings.size.width / 2;
      absoluteCoords.y += settings.size.height / 2;

      const point = scene.transformMousePosition(
        absoluteCoords.x,
        absoluteCoords.y,
        settings.size,
      );

      // These coordinates are used purely for bounds detection of the preview window.
      const boundX = Math.round(
        ((event.x - state.size.x) / state.width - 0.5) * state.width,
      );
      const boundY = Math.round(
        ((event.y - state.size.y) / state.height - 0.5) * state.height,
      );
      if (
        Math.abs(boundX) > state.width / 2 ||
        Math.abs(boundY) > state.height / 2
      ) {
        setHover?.(false);
      } else {
        // Only need to set position coordinates if hovering over the overlay
        setHover?.(true);

        setMousePos({
          x: point.x,
          y: point.y,
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [state]);

  // Below method is used for the copy to clipboard keybind
  useDocumentEvent(
    'keydown',
    useCallback(
      async event => {
        if (document.activeElement.tagName !== 'INPUT' && event.key === 'p') {
          const positionString = `${mousePos.x}, ${mousePos.y}`;
          await window.navigator.clipboard.writeText(positionString);
        }
      },
      [mousePos],
    ),
  );

  return (
    <>
      {hover && (
        <div title={'Coordinates'} className={clsx(styles.input)}>
          ({mousePos.x}, {mousePos.y})
        </div>
      )}
    </>
  );
}
