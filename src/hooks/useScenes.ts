import {usePlayer} from './usePlayer';
import {useSubscribableValue} from './useSubscribable';

export function useScenes() {
  const player = usePlayer();
  return useSubscribableValue(player.project.onScenesChanged);
}

export function useCurrentScene() {
  const player = usePlayer();
  return useSubscribableValue(player.project.onCurrentSceneChanged);
}
