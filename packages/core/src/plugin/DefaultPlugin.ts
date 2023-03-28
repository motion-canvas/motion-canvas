import {makePlugin} from './makePlugin';
import {type Exporter, ImageExporter, type Project} from '../app';

/**
 * The default plugin included in every Motion Canvas project.
 */
export default makePlugin({
  name: 'mc-default-plugin',
  exporters(project: Project): Exporter[] {
    return [new ImageExporter(project.logger)];
  },
});
