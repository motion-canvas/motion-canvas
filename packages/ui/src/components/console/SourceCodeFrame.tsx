import styles from './Console.module.scss';

import {useMemo} from 'preact/hooks';
import {
  getSourceCodeFrame,
  openFileInEditor,
  StackTraceEntry,
} from '../../utils';

import {IconButton} from '../controls';
import {OpenInNew} from '../icons';
export interface SourceFrameProps {
  entry: StackTraceEntry;
}

export function SourceCodeFrame({entry}: SourceFrameProps) {
  const frame = useMemo(
    () => (entry ? getSourceCodeFrame(entry) : null),
    [entry],
  );

  return (
    <div className={styles.sourceCode}>
      <pre>
        <code
          className="language-ts"
          dangerouslySetInnerHTML={{
            __html: frame ?? 'Could not load the source code.',
          }}
        />
      </pre>
      <IconButton
        title="Go to source"
        className={styles.viewSource}
        onClick={async () => {
          if (entry) {
            await openFileInEditor(entry);
          }
        }}
      >
        <OpenInNew />
      </IconButton>
    </div>
  );
}
