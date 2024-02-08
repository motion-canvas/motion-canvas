import styles from './Sidebar.module.scss';

import {type Thread, getTaskName} from '@motion-canvas/core/lib/threading';
import {isThreadable} from '@motion-canvas/core/lib/scenes/Threadable';
import {
  useCurrentFrame,
  useCurrentScene,
  useSubscribableValue,
} from '../../hooks';
import {Pane} from '../tabs';

export function Threads() {
  useCurrentFrame();
  const scene = useCurrentScene();
  const thread = useSubscribableValue(
    isThreadable(scene) ? scene.onThreadChanged : null,
  );

  return (
    <Pane title="Threads" id="threads-pane">
      {thread ? (
        <ThreadView thread={thread} />
      ) : (
        "The current scene doesn't support threading"
      )}
    </Pane>
  );
}

interface ThreadViewProps {
  thread: Thread;
}

function ThreadView({thread}: ThreadViewProps) {
  return (
    <div className={styles.thread}>
      <div className={styles.threadTitle}>{getTaskName(thread.runner)}</div>
      {thread.children.length > 0 && (
        <ul className={styles.threadList}>
          {thread.children.map(value => (
            <ThreadView thread={value} />
          ))}
        </ul>
      )}
    </div>
  );
}
