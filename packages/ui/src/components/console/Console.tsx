import styles from './Console.module.scss';

import {LogLevel} from '@motion-canvas/core/lib';
import {Pane} from '../tabs';
import {useLogs} from '../../contexts';
import {classes} from '../../utils';
import {useState} from 'preact/hooks';
import {IconButton, IconType, Pill} from '../controls';
import {capitalize} from '@motion-canvas/2d/lib/decorators';
import {Log} from './Log';

const LOG_LEVELS: Record<string, boolean> = {
  [LogLevel.Error]: true,
  [LogLevel.Warn]: true,
  [LogLevel.Info]: false,
  [LogLevel.Debug]: false,
};

export function Console() {
  const [logs, clear] = useLogs();
  const [filters, setFilters] = useState(LOG_LEVELS);

  return (
    <Pane title="Console">
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
          <IconButton
            icon={IconType.clear}
            onClick={clear}
            title={'Clear console'}
          />
        )}
      </div>
      <div
        className={classes(
          styles.list,
          ...Object.entries(filters)
            .filter(([, enabled]) => enabled)
            .map(([key]) => styles[key]),
        )}
      >
        {logs.map(log => (
          <Log payload={log} />
        ))}
      </div>
    </Pane>
  );
}
