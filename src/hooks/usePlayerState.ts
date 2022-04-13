import { Player, PlayerState } from "@motion-canvas/core/player/Player";
import { usePlayer } from "./usePlayer";
import { useEffect, useState } from "preact/hooks";

export function usePlayerState(): PlayerState {
  const player = usePlayer();
  const [state, setState] = useState<PlayerState>(player.getState());
  useEffect(() => {
    player.StateChanged.subscribe(setState);
    return () => player.StateChanged.unsubscribe(setState);
  }, [player]);

  return state;
}
