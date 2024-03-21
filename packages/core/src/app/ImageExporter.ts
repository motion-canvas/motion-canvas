import {EventDispatcher} from '../events';
import {
  BoolMetaField,
  EnumMetaField,
  NumberMetaField,
  ObjectMetaField,
  ValueOf,
} from '../meta';
import {clamp} from '../tweening';
import {CanvasOutputMimeType} from '../types';
import type {Exporter} from './Exporter';
import type {Logger} from './Logger';
import type {Project} from './Project';
import type {RendererSettings} from './Renderer';
import {FileTypes} from './presets';

const EXPORT_FRAME_LIMIT = 256;
const EXPORT_RETRY_DELAY = 1000;

type ImageExporterOptions = ValueOf<ReturnType<typeof ImageExporter.meta>>;

interface ServerResponse {
  frame: number;
}

/**
 * Image sequence exporter.
 *
 * @internal
 */
export class ImageExporter implements Exporter {
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
    });

    meta.fileType.onChanged.subscribe(value => {
      meta.quality.disable(value === 'image/png');
    });

    return meta;
  }

  public static async create(
    project: Project,
    settings: RendererSettings,
  ): Promise<ImageExporter> {
    return new ImageExporter(project.logger, settings);
  }

  private static readonly response = new EventDispatcher<ServerResponse>();

  static {
    if (import.meta.hot) {
      import.meta.hot.on('motion-canvas:export-ack', response => {
        this.response.dispatch(response);
      });
    }
  }

  private readonly frameLookup = new Set<number>();
  private readonly projectName: string;
  private readonly quality: number;
  private readonly fileType: CanvasOutputMimeType;
  private readonly groupByScene: boolean;

  public constructor(
    private readonly logger: Logger,
    private readonly settings: RendererSettings,
  ) {
    const options = settings.exporter.options as ImageExporterOptions;
    this.projectName = settings.name;
    this.quality = clamp(0, 1, options.quality / 100);
    this.fileType = options.fileType;
    this.groupByScene = options.groupByScene;
  }

  public async start() {
    ImageExporter.response.subscribe(this.handleResponse);
  }

  public async handleFrame(
    canvas: HTMLCanvasElement,
    frame: number,
    sceneFrame: number,
    sceneName: string,
    signal: AbortSignal,
  ) {
    if (this.frameLookup.has(frame)) {
      this.logger.warn(`Frame no. ${frame} is already being exported.`);
      return;
    }
    if (import.meta.hot) {
      while (this.frameLookup.size > EXPORT_FRAME_LIMIT) {
        await new Promise(resolve => setTimeout(resolve, EXPORT_RETRY_DELAY));
        if (signal.aborted) {
          return;
        }
      }

      this.frameLookup.add(frame);
      import.meta.hot!.send('motion-canvas:export', {
        frame,
        data: canvas.toDataURL(this.fileType, this.quality),
        mimeType: this.fileType,
        subDirectories: this.groupByScene
          ? [this.projectName, sceneName]
          : [this.projectName],
        name: (this.groupByScene ? sceneFrame : frame)
          .toString()
          .padStart(6, '0'),
      });
    }
  }

  public async stop() {
    while (this.frameLookup.size > 0) {
      await new Promise(resolve => setTimeout(resolve, EXPORT_RETRY_DELAY));
    }
    ImageExporter.response.unsubscribe(this.handleResponse);
  }

  private handleResponse = ({frame}: ServerResponse) => {
    this.frameLookup.delete(frame);
  };
}
