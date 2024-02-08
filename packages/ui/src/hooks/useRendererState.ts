import {useSubscribableValue} from './useSubscribable';
import {useApplication} from '../contexts';

export function useRendererState() {
  const {renderer} = useApplication();
  return useSubscribableValue(renderer.onStateChanged);
}
