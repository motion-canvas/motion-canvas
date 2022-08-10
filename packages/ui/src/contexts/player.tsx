import {ComponentChildren, createContext} from 'preact';
import {useContext} from 'preact/hooks';
import type {Player} from '@motion-canvas/core/lib/player';

const PlayerContext = createContext<Player | null>(null);

export function usePlayer() {
  return useContext(PlayerContext);
}

export function PlayerProvider({
  player,
  children,
}: {
  player: Player;
  children: ComponentChildren;
}) {
  return (
    <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>
  );
}
