import {useApplication} from '../contexts';
import {useSubscribableValue} from './useSubscribable';

export function useDuration() {
  const {player} = useApplication();
  return useSubscribableValue(player.onDurationChanged);
}
