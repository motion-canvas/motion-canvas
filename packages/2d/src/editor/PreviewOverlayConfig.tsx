import {isInspectable, Vector2} from '@motion-canvas/core';
import {
  MouseButton,
  OverlayWrapper,
  PluginOverlayConfig,
  useCurrentScene,
  usePreviewMatrix,
  useViewportContext,
} from '@motion-canvas/ui';
import {ComponentChildren} from 'preact';
import {useInspection} from './Provider';

function Component({children}: {children?: ComponentChildren}) {
  const state = useViewportContext();
  const scene = useCurrentScene();
  const {nodeKey} = useInspection();
  const matrix = usePreviewMatrix();

  return (
    <OverlayWrapper
      onPointerDown={event => {
        if (event.button !== MouseButton.Left || event.shiftKey) return;
        if (!isInspectable(scene)) return;
        event.stopPropagation();

        const position = new Vector2(
          event.x - state.size.x,
          event.y - state.size.y,
        ).transformAsPoint(matrix.inverse());

        nodeKey.value = scene.inspectPosition(position.x, position.y) as string;
      }}
    >
      {children}
    </OverlayWrapper>
  );
}

function drawHook() {
  const {nodeKey} = useInspection();
  const scene = useCurrentScene();
  const matrix = usePreviewMatrix();
  nodeKey.value;

  return (ctx: CanvasRenderingContext2D) => {
    if (!isInspectable(scene)) return;
    const element = scene.validateInspection(nodeKey.value);
    if (!element || element !== nodeKey.value) {
      nodeKey.value = element as string;
      return;
    }
    scene.drawOverlay(element, matrix, ctx);
  };
}

export const PreviewOverlayConfig: PluginOverlayConfig = {
  drawHook,
  component: Component,
};
