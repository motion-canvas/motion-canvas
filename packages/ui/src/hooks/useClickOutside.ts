import {MutableRef, useCallback} from 'preact/hooks';
import {useDocumentEvent} from './useDocumentEvent';

export function useClickOutside<T extends Element>(
  ref: MutableRef<T>,
  onClick: () => void,
) {
  useDocumentEvent(
    'click',
    useCallback(
      event => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          onClick();
        }
      },
      [ref.current, onClick],
    ),
  );
}
