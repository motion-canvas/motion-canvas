import {useMemo} from 'preact/hooks';
import {usePlayerState} from './usePlayerState';
import {useCurrentFrame} from './useCurrentFrame';

export function usePlayerTime() {
  const state = usePlayerState();
  const frame = useCurrentFrame();

  return useMemo(
    () => ({
      frame,
      time: frame / state.fps,
      duration: state.duration,
      durationTime: state.duration / state.fps,
      completion: frame / state.duration,
    }),
    [state, frame],
  );
}
