import {VNode} from 'preact';
import {usePlayerTime} from '../../hooks';

interface CurrentTimeProps {
  render: (time: number) => VNode<any>;
}

export function CurrentTime({render}: CurrentTimeProps) {
  const time = usePlayerTime();

  return render(time.frame);
}
