import {makePlugin} from './makePlugin';
import {ImageExporter} from '../app';

/**
 * The default plugin included in every Motion Canvas project.
 */
export default makePlugin({
  name: 'mc-default-plugin',
  exporters() {
    return [ImageExporter];
  },
});
