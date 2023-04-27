import {useEffect} from 'preact/hooks';

export function useDocumentEvent<T extends keyof DocumentEventMap>(
  type: T,
  listener: (this: Document, ev: DocumentEventMap[T]) => void,
  enabled = true,
  capture = false,
) {
  useEffect(() => {
    if (!enabled) return;
    document.addEventListener(type, listener, capture);
    return () => document.removeEventListener(type, listener, capture);
  }, [type, listener, enabled, capture]);
}
