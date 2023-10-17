import { useKeyUp, useKeyDown} from '.';
import { KeyBindingType } from '../utils/KeyCodes';

export function useKeyHold(key: KeyBindingType) {
  const isDown = useKeyDown(key);
  const isUp = useKeyUp(key);
  return isDown && !isUp;
}
