import {
  EventDispatcher,
  LogLevel,
  LogPayload,
  Logger,
  ValueDispatcher,
} from '@motion-canvas/core';

export class LoggerManager {
  public get onInspected() {
    return this.inspected.subscribable;
  }
  private readonly inspected = new EventDispatcher<string>();

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
    this.errorCount.current = logger.history.filter(
      log => log.level === LogLevel.Error,
    ).length;
    this.logger.onLogged.subscribe(this.handleLog);
  }

  public inspect(key: string) {
    this.inspected.dispatch(key);
  }

  public clear() {
    this.logs.current = [];
    this.errorCount.current = 0;
  }

  private readonly handleLog = (payload: LogPayload) => {
    this.logs.current = [...this.logs.current, payload];
    if (payload.level === LogLevel.Error) {
      this.errorCount.current++;
    }
  };
}
