import {usePlayer} from '../contexts';
import {useSubscribableValue} from './useSubscribable';

// TODO Save and restore the player state.

export function usePlayerState() {
  const player = usePlayer();
  return useSubscribableValue(player.onStateChanged);
}
