import {useEffect} from 'preact/hooks';

export function useDocumentEvent<K extends keyof DocumentEventMap>(
  type: K,
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
  enabled: boolean = true,
) {
  useEffect(() => {
    if (!enabled) return;
    document.addEventListener(type, listener);
    return () => document.removeEventListener(type, listener);
  }, [type, listener, enabled]);
}
