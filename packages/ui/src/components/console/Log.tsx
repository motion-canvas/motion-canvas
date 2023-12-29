import styles from './Console.module.scss';

import {LogLevel, LogPayload} from '@motion-canvas/core';
import clsx from 'clsx';
import {useEffect, useMemo, useState} from 'preact/hooks';
import {useApplication} from '../../contexts';
import {useFormattedNumber} from '../../hooks';
import {StackTraceEntry, resolveStackTrace} from '../../utils';
import {IconButton, Toggle} from '../controls';
import {Locate} from '../icons';
import {Collapse} from '../layout';
import {SourceCodeFrame} from './SourceCodeFrame';
import {StackTrace} from './StackTrace';

export interface LogProps {
  payload: LogPayload;
}

export function Log({payload}: LogProps) {
  const {logger} = useApplication();
  const [open, setOpen] = useState(payload.level === LogLevel.Error);
  const [entries, setEntries] = useState<StackTraceEntry[] | null>(null);
  const duration = useFormattedNumber(payload.durationMs, 2);
  const object = useMemo(
    () =>
      payload.object ? JSON.stringify(payload.object, undefined, 2) : null,
    [payload],
  );
  const userEntry = useMemo(() => {
    return entries?.find(entry => !entry.isExternal) ?? null;
  }, [entries]);

  const hasBody = !!object || !!entries || !!payload.remarks;

  useEffect(() => {
    if (payload.stack) {
      resolveStackTrace(payload.stack).then(setEntries);
    }
  }, [payload]);

  return (
    <div
      className={clsx(
        styles.log,
        styles[payload.level],
        !hasBody && styles.empty,
      )}
    >
      <div className={styles.header}>
        {hasBody && <Toggle open={open} onToggle={setOpen} />}
        <div className={styles.message}>{payload.message}</div>
        {duration !== null && (
          <code className={styles.duration}>{duration} ms</code>
        )}
        {payload.inspect && (
          <IconButton
            title="Select related node"
            onClick={() => {
              logger.inspect(payload.inspect);
            }}
          >
            <Locate />
          </IconButton>
        )}
      </div>
      {hasBody && (
        <Collapse open={open}>
          {payload.remarks && (
            <div
              className={clsx(styles.section, styles.remarks)}
              dangerouslySetInnerHTML={{__html: payload.remarks}}
            />
          )}
          {object && (
            <div className={styles.section}>
              Related object:
              <pre className={styles.code}>{object}</pre>
            </div>
          )}
          {entries && (
            <div className={styles.section}>
              The problem occurred here:
              {userEntry && <SourceCodeFrame entry={userEntry} />}
              <StackTrace entries={entries} />
            </div>
          )}
        </Collapse>
      )}
    </div>
  );
}
