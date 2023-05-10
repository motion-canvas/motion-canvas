import {makePlugin} from './makePlugin';
import {type ExporterClass, ImageExporter} from '../app';

/**
 * The default plugin included in every Motion Canvas project.
 */
export default makePlugin({
  name: 'mc-default-plugin',
  exporters(): ExporterClass[] {
    return [ImageExporter];
  },
});
