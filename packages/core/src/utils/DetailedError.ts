import type {LogPayload} from '../app';

type DetailedErrorProps = Pick<
  LogPayload,
  'message' | 'remarks' | 'object' | 'durationMs' | 'inspect'
>;

export class DetailedError extends Error {
  /**
   * {@inheritDoc app.LogPayload.message}
   */
  public readonly remarks?: string;
  /**
   * {@inheritDoc app.LogPayload.object}
   */
  public readonly object?: any;
  /**
   * {@inheritDoc app.LogPayload.durationMs}
   */
  public readonly durationMs?: number;
  /**
   * {@inheritDoc app.LogPayload.inspect}
   */
  public readonly inspect?: string;

  public constructor(message: string, remarks?: string);
  public constructor(props: DetailedErrorProps);
  public constructor(props: string | DetailedErrorProps, remarks?: string) {
    if (typeof props === 'string') {
      super(props);
      this.remarks = remarks;
    } else {
      super(props.message);
      this.remarks = props.remarks;
      this.object = props.object;
      this.durationMs = props.durationMs;
      this.inspect = props.inspect;
    }
  }
}
