import {useEffect, useState, useCallback } from 'preact/hooks';
import {useDocumentEvent} from './useDocumentEvent';
import { Action, KeyCode, KeyBindingMapping } from '@motion-canvas/core';

export declare type KeyUpCallbackType = (...args: any) => void;
export function useKeyUp(key: KeyCode, callback?: KeyUpCallbackType) {
  const [isUp, setUp] = useState(false);

  useDocumentEvent(
    'keyup',
      useCallback(event => {
        if (event.key === key.code) {
          event.preventDefault();
          setUp(true);
          callback && callback(event);
        }
      }, [key])
    )
  return isUp;
}
