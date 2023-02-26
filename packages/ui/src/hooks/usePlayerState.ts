import {useApplication} from '../contexts';
import {useSubscribableValue} from './useSubscribable';

export function usePlayerState() {
  const {player} = useApplication();
  return useSubscribableValue(player.onStateChanged);
}
