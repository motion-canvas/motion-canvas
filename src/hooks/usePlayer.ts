import { Player } from "@motion-canvas/core/player/Player";

export function usePlayer(): Player {
  //@ts-ignore
  return window.player;
}
