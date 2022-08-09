import {useSubscribableValue} from './useSubscribable';
import {usePlayer} from '../contexts';

export function useCurrentFrame() {
  const player = usePlayer();
  return useSubscribableValue(player.onFrameChanged);
}
