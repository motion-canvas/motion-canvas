import type {PlayerState} from '@motion-canvas/core/lib/player/Player';
import {usePlayer} from './usePlayer';
import {useSubscribableValue} from './useSubscribable';

const player = usePlayer();
const storageKey = `${player.project.name}-player-state`;
const savedState = localStorage.getItem(storageKey);
if (savedState) {
  const state = JSON.parse(savedState) as PlayerState;
  player.loadState(state);
}

player.onStateChanged.subscribe(state => {
  localStorage.setItem(storageKey, JSON.stringify(state));
});

export function usePlayerState() {
  const player = usePlayer();
  return useSubscribableValue(player.onStateChanged);
}
