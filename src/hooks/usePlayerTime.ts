import type {PlayerTime} from '@motion-canvas/core/lib/player/Player';
import {usePlayer} from './usePlayer';
import {useEventState} from './useEventState';

export function usePlayerTime(): PlayerTime {
  const player = usePlayer();
  return useEventState(player.TimeChanged, () => player.getTime());
}
