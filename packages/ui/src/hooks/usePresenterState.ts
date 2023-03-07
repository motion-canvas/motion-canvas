import {useSubscribableValue} from './useSubscribable';
import {useApplication} from '../contexts';

export function usePresenterState() {
  const {presenter} = useApplication();
  return useSubscribableValue(presenter.onStateChanged);
}
