import {PlayerTime} from '@motion-canvas/core/player/Player';
import {usePlayer} from './usePlayer';
import {useEffect, useState} from 'preact/hooks';

export function usePlayerTime(): PlayerTime {
  const player = usePlayer();
  const [state, setState] = useState<PlayerTime>(player.getTime());
  useEffect(() => {
    setState(player.getTime());
    player.TimeChanged.subscribe(setState);
    return () => player.TimeChanged.unsubscribe(setState);
  }, [player]);

  return state;
}
