import {useEffect, useState} from 'react';
import {InfoBox} from '../controls/InfoBox';
import {useCallback, useContext} from 'preact/hooks';
import {useDocumentEvent} from '../../hooks';
import {ViewportContext} from './ViewportContext';

export function Coordinates() {
  const [mousePos, setMousePos] = useState({x: 0, y: 0});
  const [hover, setHover] = useState(true);

  const state = useContext(ViewportContext);

  useEffect(() => {
    const handleMouseMove = (event: {x: number; y: number}) => {
      // This selector probably needs to be improved to select the overlay more reliably (future proof).
      // Possibly use the internal state instead of a selector.
      const canvas = document.getElementsByTagName('canvas')[1];
      const rect = canvas.getBoundingClientRect();
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
        setHover?.(true);
        // Only need to set position coordinates if hovering over the overlay
        let canvasPosX = event.x - state.size.x;
        let canvasPosY = event.y - state.size.y;

        canvasPosX -= state.x + state.width / 2;
        canvasPosY -= state.y + state.height / 2;
        canvasPosX /= state.zoom;
        canvasPosY /= state.zoom;

        canvasPosX = Math.round(canvasPosX);
        canvasPosY = Math.round(canvasPosY);

        setMousePos({
          x: canvasPosX,
          y: canvasPosY,
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
        <InfoBox>
          ({mousePos.x}, {mousePos.y})
        </InfoBox>
      )}
    </>
  );
}
