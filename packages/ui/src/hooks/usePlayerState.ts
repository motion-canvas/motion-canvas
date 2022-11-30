import {usePlayer} from '../contexts';
import {useSubscribableValue} from './useSubscribable';

export function usePlayerState() {
  const player = usePlayer();
  return useSubscribableValue(player.onStateChanged);
}
