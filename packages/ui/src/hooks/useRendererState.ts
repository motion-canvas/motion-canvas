import {useApplication} from '../contexts';
import {useSubscribableValue} from './useSubscribable';

export function useRendererState() {
  const {renderer} = useApplication();
  return useSubscribableValue(renderer.onStateChanged);
}
