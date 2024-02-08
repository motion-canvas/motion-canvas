import styles from './Console.module.scss';

import {LogLevel} from '@motion-canvas/core';
import {capitalize} from '@motion-canvas/core/lib/utils';
import {Pane} from '../tabs';
import {useLogs} from '../../contexts';
import {useLayoutEffect, useRef} from 'preact/hooks';
import {IconButton, Pill} from '../controls';
import {Log} from './Log';
import clsx from 'clsx';
import {Clear} from '../icons';
import {useStorage} from '../../hooks';

const LOG_LEVELS: Record<string, boolean> = {
  [LogLevel.Error]: true,
  [LogLevel.Warn]: true,
  [LogLevel.Info]: false,
  [LogLevel.Debug]: false,
};

export function Console() {
  const anchor = useRef<HTMLDivElement>();
  const [logs, clear] = useLogs();
  const [filters, setFilters] = useStorage('log-filters', LOG_LEVELS);

  useLayoutEffect(() => {
    anchor.current.scrollIntoView();
  }, []);

  return (
    <Pane title="Console" id="console">
      <div className={styles.navbar}>
        <div className={styles.pills}>
          {Object.keys(LOG_LEVELS).map(level => {
            const logCount =
              !filters[level] && logs.filter(log => log.level === level).length;
            return (
              <Pill
                key={level}
                titleOn={`Exclude ${level} logs`}
                titleOff={`Include ${level} logs`}
                checked={filters[level]}
                onChange={value => setFilters({...filters, [level]: value})}
              >
                {capitalize(level)}{' '}
                {logCount > 0 && `(${logCount > 99 ? '99+' : logCount})`}
              </Pill>
            );
          })}
        </div>
        {logs.length > 0 && (
          <IconButton onClick={clear} title={'Clear console'}>
            <Clear />
          </IconButton>
        )}
      </div>
      <div
        className={clsx(
          styles.list,
          ...Object.entries(filters)
            .filter(([, enabled]) => enabled)
            .map(([key]) => styles[key]),
        )}
      >
        {logs.map(log => (
          <Log payload={log} />
        ))}
        <div ref={anchor} className={styles.anchor} />
      </div>
    </Pane>
  );
}
