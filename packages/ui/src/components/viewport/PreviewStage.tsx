import {Stage} from '@motion-canvas/core';
import {JSX} from 'preact';
import {useEffect, useRef, useState} from 'preact/hooks';
import {useApplication} from '../../contexts';
import {
  usePreviewSettings,
  useSharedSettings,
  useSubscribable,
} from '../../hooks';

export function PreviewStage(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [stage] = useState(() => new Stage());
  const ref = useRef<HTMLDivElement>();
  const {player} = useApplication();
  const {size, background} = useSharedSettings();
  const {resolutionScale} = usePreviewSettings();

  useSubscribable(
    player.onRender,
    async () => {
      await stage.render(
        player.playback.currentScene,
        player.playback.previousScene,
      );
    },
    [],
  );

  useEffect(() => {
    stage.configure({resolutionScale, size, background});
    stage.render(player.playback.currentScene, player.playback.previousScene);
  }, [resolutionScale, size, background]);

  useEffect(() => {
    ref.current.append(stage.finalBuffer);
    return () => stage.finalBuffer.remove();
  }, []);

  return <div ref={ref} {...props} />;
}
