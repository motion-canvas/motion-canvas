import {useSubscribableValue} from './useSubscribable';
import {usePlayer} from '../contexts';

export function useScenes() {
  const player = usePlayer();
  return useSubscribableValue(player.project.onScenesChanged);
}

export function useCurrentScene() {
  const player = usePlayer();
  return useSubscribableValue(player.project.onCurrentSceneChanged);
}
