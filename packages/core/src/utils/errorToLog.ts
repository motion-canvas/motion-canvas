import type {LogPayload} from '../app';

export function errorToLog(error: any): LogPayload {
  return {
    message: error.message,
    stack: error.stack,
    remarks: error.remarks,
  };
}
