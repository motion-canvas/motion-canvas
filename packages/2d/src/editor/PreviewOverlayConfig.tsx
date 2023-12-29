import {isInspectable, Vector2} from '@motion-canvas/core';
import {
  MouseButton,
  OverlayWrapper,
  PluginOverlayConfig,
  useCurrentScene,
  useViewportContext,
  useViewportMatrix,
} from '@motion-canvas/ui';
import {ComponentChildren} from 'preact';
import {useInspection} from './Provider';

function Component({children}: {children?: ComponentChildren}) {
  const state = useViewportContext();
  const scene = useCurrentScene();
  const {nodeKey} = useInspection();
  const matrix = useViewportMatrix();

  return (
    <OverlayWrapper
      onPointerDown={event => {
        if (event.button !== MouseButton.Left || event.shiftKey) return;
        if (!isInspectable(scene)) return;
        event.stopPropagation();

        const position = new Vector2(
          event.x - state.rect.x,
          event.y - state.rect.y,
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
  nodeKey.value;

  return (ctx: CanvasRenderingContext2D, matrix: DOMMatrix) => {
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
