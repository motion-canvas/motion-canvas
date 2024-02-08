import { useKeyDown } from './useKeyDown';
import { UIAction } from '../Index';
import { Action } from '@motion-canvas/core';

export declare type KeyActionCallbackType = (...args: any) => void;
export function useAction(action: Action, callback?: KeyActionCallbackType) {
   return action.keys.map(key => useKeyDown(key, callback))
}