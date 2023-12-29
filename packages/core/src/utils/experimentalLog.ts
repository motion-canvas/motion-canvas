import {LogLevel, LogPayload} from '../app';
import experimentalFeatures from './__logs__/experimental-features.md';

export function experimentalLog(message: string, remarks?: string): LogPayload {
  return {
    level: LogLevel.Error,
    message,
    remarks: (remarks ?? '') + experimentalFeatures,
  };
}
