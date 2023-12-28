import {isInspectable, Vector2} from '@motion-canvas/core';
import {useCallback} from 'preact/hooks';
import {useEffect, useState} from 'react';
import {useViewportContext} from '../../contexts';
import {
  useCurrentScene,
  useDocumentEvent,
  useViewportMatrix,
} from '../../hooks';
import {ReadOnlyInput} from '../controls';
import styles from './Viewport.module.scss';

export function Coordinates() {
  const [mousePos, setMousePos] = useState({x: 0, y: 0});
  const state = useViewportContext();
  const scene = useCurrentScene();
  const matrix = useViewportMatrix();

  useEffect(() => {
    const handleMouseMove = (event: {x: number; y: number}) => {
      if (!isInspectable(scene)) return;

      let point = new Vector2(
        event.x - state.rect.x,
        event.y - state.rect.y,
      ).transformAsPoint(matrix.inverse());
      point = scene.transformMousePosition(point.x, point.y);

      setMousePos({
        x: Math.round(point.x),
        y: Math.round(point.y),
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [state, matrix]);

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
    <ReadOnlyInput className={styles.coordinates} title={'Coordinates'}>
      ({mousePos.x}, {mousePos.y})
    </ReadOnlyInput>
  );
}
