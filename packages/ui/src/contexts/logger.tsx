import {
  LogLevel,
  LogPayload,
  Logger,
  ValueDispatcher,
} from '@motion-canvas/core';
import {ComponentChildren, createContext} from 'preact';
import {useContext, useRef} from 'preact/hooks';
import {useSubscribable, useSubscribableValue} from '../hooks';
import {useApplication} from './application';

export class LoggerManager {
  public get onErrorLogged() {
    return this.errorCount.subscribable;
  }
  private readonly errorCount = new ValueDispatcher(0);

  public get onLogsChanged() {
    return this.logs.subscribable;
  }
  private readonly logs = new ValueDispatcher<LogPayload[]>([]);

  public constructor(private readonly logger: Logger) {
    this.logs.current = logger.history;
    this.logger.onLogged.subscribe(this.handleLog);
  }

  public readonly clear = () => {
    this.logs.current = [];
    this.errorCount.current = 0;
  };

  private readonly handleLog = (payload: LogPayload) => {
    this.logs.current = [...this.logs.current, payload];
    if (payload.level === LogLevel.Error) {
      this.errorCount.current++;
    }
  };
}

const LoggerContext = createContext<LoggerManager | null>(null);

export function useLogger() {
  return useContext(LoggerContext);
}

export function useLogs(): [LogPayload[], () => void] {
  const logger = useLogger();
  const logs = useSubscribableValue(logger.onLogsChanged);
  return [logs, logger.clear];
}

export interface LoggerProviderProps {
  children: ComponentChildren;
}
export function LoggerProvider({children}: LoggerProviderProps) {
  const {project, player} = useApplication();
  const manager = useRef<LoggerManager | null>(null);
  manager.current ??= new LoggerManager(project.logger);
  useSubscribable(player.onRecalculated, () => manager.current.clear(), []);

  return (
    <LoggerContext.Provider value={manager.current}>
      {children}
    </LoggerContext.Provider>
  );
}
