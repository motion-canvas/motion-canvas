import styles from './Console.module.scss';

import {useMemo} from 'preact/hooks';
import {
  getSourceCodeFrame,
  openFileInEditor,
  StackTraceEntry,
} from '../../utils';

export interface SourceFrameProps {
  entry: StackTraceEntry;
}

export function SourceCodeFrame({entry}: SourceFrameProps) {
  const frame = useMemo(
    () => (entry ? getSourceCodeFrame(entry) : null),
    [entry],
  );

  return (
    <pre
      className={styles.code}
      onDblClick={async () => {
        if (entry) {
          await openFileInEditor(entry);
        }
      }}
      onMouseDown={e => {
        // Prevent selection when double-clicking.
        if (e.detail > 1) {
          e.preventDefault();
        }
      }}
    >
      {frame ?? 'Could not load the source code.'}
    </pre>
  );
}
