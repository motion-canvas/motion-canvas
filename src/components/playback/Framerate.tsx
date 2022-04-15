import {VNode} from 'preact';
import {useMemo, useRef} from 'preact/hooks';
import {usePlayerTime} from '../../hooks';

interface FramerateProps {
  render: (framerate: number) => VNode<any>;
}

export function Framerate({render}: FramerateProps) {
  const time = usePlayerTime();
  const {current: state} = useRef({
    history: [],
    lastUpdate: performance.now(),
    overallTime: 0,
  });

  const framerate = useMemo(() => {
    const passed = performance.now() - state.lastUpdate;
    state.overallTime += passed;
    state.history.push(passed);
    if (state.history.length > 10) {
      state.overallTime -= state.history.shift();
    }

    const value = Math.floor(1000 / (state.overallTime / state.history.length));
    state.lastUpdate = performance.now();
    return value;
  }, [time.frame]);

  return render(framerate);
}
