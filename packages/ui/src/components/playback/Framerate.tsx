import {VNode} from 'preact';
import {useMemo, useRef} from 'preact/hooks';
import {usePlayerState, usePlayerTime} from '../../hooks';

interface FramerateProps {
  render: (framerate: number, paused: boolean) => VNode<unknown>;
}

export function Framerate({render}: FramerateProps) {
  const {paused} = usePlayerState();
  const time = usePlayerTime();
  const {current: state} = useRef({
    history: [],
    lastUpdate: 0,
    overallTime: -1,
  });

  const framerate = useMemo(() => {
    if (paused) {
      state.overallTime = -1;
      state.history = [];
      return 0;
    }

    if (state.overallTime < 0) {
      state.overallTime = 0;
      state.lastUpdate = performance.now();
      return 0;
    }

    const passed = performance.now() - state.lastUpdate;
    state.overallTime += passed;
    state.history.push(passed);
    if (state.history.length > 10) {
      state.overallTime -= state.history.shift();
    }

    const value = Math.floor(1000 / (state.overallTime / state.history.length));
    state.lastUpdate = performance.now();
    return value;
  }, [time.frame, paused]);

  return render(framerate, paused);
}
