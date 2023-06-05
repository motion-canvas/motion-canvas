import {useEffect, useState} from 'react';
import {InfoBox} from '../controls/InfoBox';
import {useCallback} from 'preact/hooks';
import {useDocumentEvent} from '../../hooks';
import {ViewportState} from './ViewportContext';

interface CoordinatesProps {
  viewState: ViewportState;
  viewSize: DOMRectReadOnly;
}

export function Coordinates({viewState, viewSize}: CoordinatesProps) {
  const [mousePos, setMousePos] = useState({x: 0, y: 0});
  const [hover, setHover] = useState(true);

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
        let canvasPosX = event.x - viewSize.x;
        let canvasPosY = event.y - viewSize.y;

        canvasPosX -= viewState.x + viewState.width / 2;
        canvasPosY -= viewState.y + viewState.height / 2;
        canvasPosX /= viewState.zoom;
        canvasPosY /= viewState.zoom;

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
  }, [viewState, viewSize]);

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
