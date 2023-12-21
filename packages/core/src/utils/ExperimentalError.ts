import type {LogPayload} from '../app';
import {DetailedError} from './DetailedError';
import experimentalFeatures from './__logs__/experimental-features.md';

type ExperimentalErrorProps = Pick<
  LogPayload,
  'message' | 'remarks' | 'object' | 'durationMs' | 'inspect'
>;

export class ExperimentalError extends DetailedError {
  public constructor(message: string, remarks?: string);
  public constructor(props: ExperimentalErrorProps);
  public constructor(props: string | ExperimentalErrorProps, remarks?: string) {
    if (typeof props === 'string') {
      super({
        message: props,
        remarks: (remarks ?? '') + experimentalFeatures,
      });
    } else {
      super({
        ...props,
        remarks: (props.remarks ?? '') + experimentalFeatures,
      });
    }
  }
}
