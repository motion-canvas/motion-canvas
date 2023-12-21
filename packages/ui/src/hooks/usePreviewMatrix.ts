import {useMemo} from 'preact/hooks';
import {useViewportContext} from '../contexts';
import {usePreviewSettings, useSharedSettings} from './useSettings';

/**
 * Get a matrix that transforms the preview canvas space to the scene space.
 *
 * @remarks
 * When drawing the preview overlay, the canvas overlays the entire preview
 * panel, no matter the zoom and pan of the scene itself. It ensures that
 * the gizmos drawn on top have high resolution no matter how zoomed in the user
 * is.
 *
 * This matrix is used to transform the drawn points so that they appear where
 * they should be in the scene.
 */
export function usePreviewMatrix() {
  const {size} = useSharedSettings();
  const {resolutionScale} = usePreviewSettings();
  const state = useViewportContext();

  return useMemo(() => {
    const matrix = new DOMMatrix();
    if (!size) {
      return matrix;
    }

    const offset = size.scale(-0.5);
    matrix.translateSelf(state.x + state.width / 2, state.y + state.height / 2);
    matrix.scaleSelf(state.zoom, state.zoom);
    matrix.translateSelf(offset.width, offset.height);

    return matrix;
  }, [size, state, resolutionScale]);
}
