import {ThreadGenerator} from '../threading';
import {decorate, threadable} from '../decorators';

decorate(noop, threadable());
/**
 * Do nothing.
 */
export function* noop(): ThreadGenerator {
  // do nothing
}
