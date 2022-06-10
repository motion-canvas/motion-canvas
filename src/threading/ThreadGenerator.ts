import type {Project} from '../Project';
import {JoinYieldResult} from './join';
import {CancelYieldResult} from './cancel';

export type ThreadGenerator = Generator<
  ThreadGenerator | JoinYieldResult | CancelYieldResult | Promise<any> | symbol,
  void,
  ThreadGenerator | Project | any
>;

export function isThreadGenerator(value: unknown): value is ThreadGenerator {
  return typeof value === 'object' && Symbol.iterator in value;
}
