import {useSubscribableValue} from './useSubscribable';
import {usePlayer} from './usePlayer';

export function useCurrentFrame() {
  const player = usePlayer();
  return useSubscribableValue(player.onFrameChanged);
}
