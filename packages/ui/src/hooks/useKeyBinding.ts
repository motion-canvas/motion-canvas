
import {useEffect, useState, useCallback } from 'preact/hooks';
import {useDocumentEvent} from './useDocumentEvent';
import { useKeyDown } from './useKeyDown';
import { Action, KeyCode, UIAction } from '../global';
import { KeyBindingMap } from '../utils/keyBindingMap';
import { useAction } from './useAction';

/**
 * In case you want to add a new key binding that is not a pre-defined UIAction (testing/debug purposes maybe?)
 * This function will register the new key binding in the global static map, assigning it to a newly created UI Action
 * @param key the keycode to trigger the action
 * @param actionName the action name, this is supposed to be a non-existing UI Action so a string should be enough
 * @param callback 
 */
export function useKeyBinding(key: KeyCode, actionName: string, callback: () => void) {
   KeyBindingMap.bindKeyToAction(key, new Action(actionName, key));
   return useKeyDown(key, callback, actionName);
}