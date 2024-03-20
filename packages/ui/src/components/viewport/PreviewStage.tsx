import {Stage} from '@motion-canvas/core';
import {JSX} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import {useApplication} from '../../contexts';
import {
  usePreviewSettings,
  useSharedSettings,
  useSubscribable,
} from '../../hooks';
import {StageView} from './StageView';

export function PreviewStage(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [stage] = useState(() => new Stage());
  const {player} = useApplication();
  const {size, background, motionBlurDuration} = useSharedSettings();
  const {resolutionScale, motionBlurSamples} = usePreviewSettings();

  useSubscribable(
    player.onRender,
    async () => {
      await stage.render(
        player.playback.currentScene,
        player.playback.previousScene,
        player.playback,
      );
    },
    [],
  );

  useEffect(() => {
    stage.configure({
      resolutionScale,
      size,
      motionBlurSamples,
      motionBlurDuration,
      background,
    });
    player.requestRender();
  }, [
    resolutionScale,
    size,
    motionBlurSamples,
    motionBlurDuration,
    background,
    player,
  ]);

  return <StageView stage={stage} {...props} />;
}
