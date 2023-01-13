import {EventDispatcher} from './events';

export enum LogLevel {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Http = 'http',
  Verbose = 'verbose',
  Debug = 'debug',
  Silly = 'silly',
}

export interface LogPayload {
  level?: LogLevel;
  message: string;
  stack?: string;
  remarks?: string;
  object?: any;
  durationMs?: number;
  [K: string]: any;
}

export class Logger {
  /**
   * Triggered when a new message is logged.
   */
  public get onLogged() {
    return this.logged.subscribable;
  }
  private readonly logged = new EventDispatcher<LogPayload>();
  public readonly history: LogPayload[] = [];

  private profilers: Record<string, number> = {};

  public log(payload: LogPayload) {
    this.logged.dispatch(payload);
    this.history.push(payload);
  }

  public error(payload: string | LogPayload) {
    this.logLevel(LogLevel.Error, payload);
  }

  public warn(payload: string | LogPayload) {
    this.logLevel(LogLevel.Warn, payload);
  }

  public info(payload: string | LogPayload) {
    this.logLevel(LogLevel.Info, payload);
  }

  public http(payload: string | LogPayload) {
    this.logLevel(LogLevel.Http, payload);
  }

  public verbose(payload: string | LogPayload) {
    this.logLevel(LogLevel.Verbose, payload);
  }

  public debug(payload: string | LogPayload) {
    this.logLevel(LogLevel.Debug, payload);
  }

  public silly(payload: string | LogPayload) {
    this.logLevel(LogLevel.Silly, payload);
  }

  protected logLevel(level: LogLevel, payload: string | LogPayload) {
    const result = typeof payload === 'string' ? {message: payload} : payload;
    result.level = level;
    this.log(result);
  }

  public profile(id: string, payload?: LogPayload) {
    const time = performance.now();
    if (this.profilers[id]) {
      const timeEnd = this.profilers[id];
      delete this.profilers[id];

      const result = payload ?? {message: id};
      result.level ??= LogLevel.Debug;
      result.durationMs = time - timeEnd;
      this.log(result);

      return;
    }

    this.profilers[id] = time;
  }
}
