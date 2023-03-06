import {useApplication} from '../contexts';
import {useSubscribableValue} from './useSubscribable';

export function useSharedSettings() {
  const {meta} = useApplication();
  return useSubscribableValue(meta.shared.onChanged);
}

export function usePreviewSettings() {
  const {meta} = useApplication();
  return useSubscribableValue(meta.preview.onChanged);
}

export function useRenderingSettings() {
  const {meta} = useApplication();
  return useSubscribableValue(meta.rendering.onChanged);
}
