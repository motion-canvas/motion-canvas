import {useMemo} from 'preact/hooks';
import {useViewportContext} from '../contexts';
import {useSharedSettings} from './useSettings';

/**
 * Get a matrix that transforms the overlay canvas space to the scene space.
 *
 * @remarks
 * When drawing a viewport overlay, the canvas overlays the entire preview
 * panel, no matter the zoom and pan of the scene itself. This ensures that
 * the gizmos drawn on top have high resolution no matter how zoomed-in the user
 * is.
 *
 * This matrix is used to transform the drawn points so that they appear where
 * they should be in the scene.
 */
export function useViewportMatrix() {
  const {size} = useSharedSettings();
  const state = useViewportContext();

  return useMemo(() => {
    const matrix = new DOMMatrix();
    if (!size) {
      return matrix;
    }

    const offset = size.scale(state.resolutionScale / -2);
    const scale = state.zoom / state.resolutionScale;
    matrix.translateSelf(
      state.x + state.rect.width / 2,
      state.y + state.rect.height / 2,
    );
    matrix.scaleSelf(scale, scale);
    matrix.translateSelf(offset.width, offset.height);

    return matrix;
  }, [size, state]);
}
