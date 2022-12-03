import styles from './Console.module.scss';

import {classes, openFileInEditor, StackTraceEntry} from '../../utils';

export interface StackTraceProps {
  entries: StackTraceEntry[];
}

export function StackTrace({entries}: StackTraceProps) {
  return (
    <div className={styles.stack}>
      {entries.map(entry => (
        <div
          className={classes(styles.entry, [styles.external, entry.isExternal])}
        >
          at (
          {entry.isExternal ? (
            `${entry.file}:${entry.line}:${entry.column}`
          ) : (
            <span
              className={styles.link}
              onClick={() => openFileInEditor(entry)}
            >
              {entry.file}:{entry.line}:{entry.column}
            </span>
          )}
          )
        </div>
      ))}
    </div>
  );
}
