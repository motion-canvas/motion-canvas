import {useSubscribableValue} from './useSubscribable';
import {useApplication} from '../contexts';

export function useScenes() {
  const {player} = useApplication();
  return useSubscribableValue(player.playback.onScenesRecalculated);
}

export function useCurrentScene() {
  const {player} = useApplication();
  return useSubscribableValue(player.playback.onSceneChanged);
}
