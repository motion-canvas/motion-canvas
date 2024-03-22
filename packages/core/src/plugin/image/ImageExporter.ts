import type {Exporter, Project, RendererSettings} from '../../app';
import {FileTypes} from '../../app/presets';
import {
  BoolMetaField,
  EnumMetaField,
  NumberMetaField,
  ObjectMetaField,
  ValueOf,
} from '../../meta';
import {MultiThreadedExporter} from './MultiThreadedExporter';
import {SingleThreadedExporter} from './SingleThreadedExporter';

export const EXPORT_RETRY_DELAY = 100;

export type ImageExporterOptions = ValueOf<
  ReturnType<typeof ImageExporter.meta>
>;

/**
 * Image sequence exporter.
 *
 * @internal
 */
export class ImageExporter {
  public static readonly id = '@motion-canvas/core/image-sequence';
  public static readonly displayName = 'Image sequence';

  public static meta() {
    const meta = new ObjectMetaField(this.name, {
      fileType: new EnumMetaField('file type', FileTypes),
      quality: new NumberMetaField('quality', 100)
        .setRange(0, 100)
        .describe('A number between 0 and 100 indicating the image quality.'),
      groupByScene: new BoolMetaField('group by scene', false).describe(
        'Group exported images by scene. When checked, separates the sequence into subdirectories for each scene in the project.',
      ),
      workerCount: new NumberMetaField('worker count', 4)
        .setRange(0, 64)
        .space()
        .describe(
          'The number of concurrent workers used for exporting images. Setting it to zero disables web workers entirely.',
        ),
      concurrentLimit: new NumberMetaField('concurrent limit', 256)
        .setRange(1, 256)
        .describe(
          'The maximum number of frames being sent to the server at the same time.',
        ),
    });

    meta.fileType.onChanged.subscribe(value => {
      meta.quality.disable(value === 'image/png');
    });

    return meta;
  }

  public static async create(
    project: Project,
    settings: RendererSettings,
  ): Promise<Exporter> {
    const options = settings.exporter.options as ImageExporterOptions;
    return options.workerCount > 0
      ? new MultiThreadedExporter(project.logger, settings)
      : new SingleThreadedExporter(project.logger, settings);
  }
}
