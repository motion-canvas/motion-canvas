import {useApplication} from '../contexts';
import {useSubscribableValue} from './useSubscribable';

export function usePresenterState() {
  const {presenter} = useApplication();
  return useSubscribableValue(presenter.onStateChanged);
}
