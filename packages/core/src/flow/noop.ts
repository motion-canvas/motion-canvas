import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from '../threading';

decorate(noop, threadable());
/**
 * Do nothing.
 */
export function* noop(): ThreadGenerator {
  // do nothing
}
