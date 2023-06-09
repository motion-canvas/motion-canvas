import {useEffect, useState} from 'react';
import {useCallback, useContext} from 'preact/hooks';
import {
  useCurrentScene,
  useDocumentEvent,
  usePreviewSettings,
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
    ...usePreviewSettings(),
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
      // This selector probably needs to be improved to select the overlay more reliably (future proof).
      // Possibly use the internal state instead of a selector.
      const canvas = document.getElementsByTagName('canvas')[1];
      const rect = canvas.getBoundingClientRect();

      // These coordinates are used purely for bounds detection of the preview window.
      const xPos = Math.round(
        ((event.x - rect.x) / rect.width - 0.5) * canvas.width,
      );
      const yPos = Math.round(
        ((event.y - rect.y) / rect.height - 0.5) * canvas.height,
      );
      if (
        Math.abs(xPos) > canvas.width / 2 ||
        Math.abs(yPos) > canvas.height / 2
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
        if (document.activeElement.tagName !== 'INPUT' && event.key === 'c') {
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
        <div className={clsx(styles.input)}>
          ({mousePos.x}, {mousePos.y})
        </div>
        // <InfoBox>
        //   ({mousePos.x}, {mousePos.y})
        // </InfoBox>
      )}
    </>
  );
}
