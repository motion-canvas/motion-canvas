import { useKeyUp, useKeyDown} from '.';
import { Action, KeyCode, KeyBindingMapping } from '@motion-canvas/core';

export function useKeyHold(key: KeyCode) {
  const isDown = useKeyDown(key);
  const isUp = useKeyUp(key);
  return isDown && !isUp;
}
