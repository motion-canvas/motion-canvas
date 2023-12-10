import {RendererState} from '@motion-canvas/core';
import {useApplication} from '../contexts';
import {useRendererState} from './useRendererState';
import {usePreviewSettings, useRenderingSettings} from './useSettings';
import {useSubscribableValue} from './useSubscribable';

export function useCurrentFrame() {
  const {player, renderer} = useApplication();
  const playerFrame = useSubscribableValue(player.onFrameChanged);
  const rendererFrame = useSubscribableValue(renderer.onFrameChanged);
  const rendererState = useRendererState();
  const preview = usePreviewSettings();
  const rendering = useRenderingSettings();

  return rendererState === RendererState.Working
    ? Math.floor((rendererFrame / rendering.fps) * preview.fps)
    : playerFrame;
}
