import {EventDispatcher} from '../events';

export enum LogLevel {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Http = 'http',
  Verbose = 'verbose',
  Debug = 'debug',
  Silly = 'silly',
}

/**
 * Represents an individual log entry.
 *
 * @remarks
 * When displayed in the editor, the log entry will have the following format:
 * ```
 *                              inspect node ┐
 *   ┌ expand more          duration ┐       │
 *   ▼                               ▼       ▼
 * ┌────────────────────────────────────────────┐
 * │ ▶ message                       300 ms (+) │
 * ├────────────────────────────────────────────┤
 * │ remarks                                    │
 * │ object                                     │
 * │ stacktrace                                 │
 * └────────────────────────────────────────────┘
 * ```
 */
export interface LogPayload {
  /**
   * The log level.
   */
  level?: LogLevel;

  /**
   * The main message of the log.
   *
   * @remarks
   * Always visible.
   */
  message: string;

  /**
   * Additional information about the log.
   *
   * @remarks
   * Visible only when the log is expanded.
   */
  remarks?: string;

  /**
   * An object that will be serialized as JSON and displayed under the message.
   *
   * @remarks
   * Visible only when the log is expanded.
   */
  object?: any;

  /**
   * The stack trace of the log.
   *
   * @remarks
   * Visible only when the log is expanded.
   * The current stack trace can be obtained using `new Error().stack`.
   * Both Chromium and Firefox stack traces are supported.
   */
  stack?: string;

  /**
   * An optional duration in milliseconds.
   *
   * @remarks
   * Can be used to display any duration related to the log.
   * The value is always visible next to the message.
   */
  durationMs?: number;

  /**
   * An optional key used to inspect a related object.
   *
   * @remarks
   * This will be used together with the {@link scenes.Inspectable} interface to
   * display additional information about the inspected object.
   * When specified, the log will have an "inspect" button that will open the
   * "Properties" tab and select the inspected object.
   */
  inspect?: string;

  /**
   * Any additional information that the log may contain.
   */
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
