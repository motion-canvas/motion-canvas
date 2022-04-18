import {useEffect} from 'preact/hooks';

export function useDocumentEvent<K extends keyof DocumentEventMap>(
  type: K,
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
  enabled: boolean = true,
  capture: boolean = false,
) {
  useEffect(() => {
    if (!enabled) return;
    document.addEventListener(type, listener, capture);
    return () => document.removeEventListener(type, listener, capture);
  }, [type, listener, enabled, capture]);
}
