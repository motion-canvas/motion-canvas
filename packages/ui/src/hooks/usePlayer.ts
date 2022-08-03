import type {Player} from '@motion-canvas/core/lib/player/Player';

export function usePlayer(): Player {
  return (<{player: Player}>(<unknown>window)).player;
}
