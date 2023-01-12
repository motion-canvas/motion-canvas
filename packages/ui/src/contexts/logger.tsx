import {ComponentChildren, createContext} from 'preact';
import {useContext, useRef} from 'preact/hooks';
import {LogLevel, LogPayload, Project} from '@motion-canvas/core/lib';
import {ValueDispatcher} from '@motion-canvas/core/lib/events';
import {useProject} from './project';
import {useSubscribableValue} from '../hooks';

export class LoggerManager {
  public get onErrorLogged() {
    return this.errorCount.subscribable;
  }
  private readonly errorCount = new ValueDispatcher(0);

  public get onLogsChanged() {
    return this.logs.subscribable;
  }
  private readonly logs = new ValueDispatcher<LogPayload[]>([]);

  private readonly logger;

  public constructor(project: Project) {
    this.logger = project.logger;
    this.logs.current = project.logger.history;
    this.logger.onLogged.subscribe(this.handleLog);
    project.onReloaded.subscribe(this.clear);
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
  const project = useProject();
  const manager = useRef<LoggerManager | null>(null);
  manager.current ??= new LoggerManager(project);

  return (
    <LoggerContext.Provider value={manager.current}>
      {children}
    </LoggerContext.Provider>
  );
}
