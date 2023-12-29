import {useApplication} from '../contexts';
import {useSubscribableValue} from './useSubscribable';

export function useScenes() {
  const {player} = useApplication();
  return useSubscribableValue(player.playback.onScenesRecalculated);
}

export function useCurrentScene() {
  const {player} = useApplication();
  return useSubscribableValue(player.playback.onSceneChanged);
}
