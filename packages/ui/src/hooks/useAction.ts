import { useKeyDown } from './useKeyDown';
import { Action } from '../global';

export function useAction(action: Action, callback?: () => void) {
   return action.keys.map(key => useKeyDown(key, callback))
}