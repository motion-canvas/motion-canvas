import styles from './Console.module.scss';

import {LogLevel, capitalize} from '@motion-canvas/core';
import clsx from 'clsx';
import {useLayoutEffect, useRef} from 'preact/hooks';
import {useApplication} from '../../contexts';
import {useStorage, useSubscribableValue} from '../../hooks';
import {IconButton, Pill} from '../controls';
import {Clear} from '../icons';
import {Pane} from '../tabs';
import {Log} from './Log';

const LOG_LEVELS: Record<string, boolean> = {
  [LogLevel.Error]: true,
  [LogLevel.Warn]: true,
  [LogLevel.Info]: false,
  [LogLevel.Debug]: false,
};

export function Console() {
  const anchor = useRef<HTMLDivElement>();
  const {logger} = useApplication();
  const logs = useSubscribableValue(logger.onLogsChanged);
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
          <IconButton onClick={() => logger.clear()} title={'Clear console'}>
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
