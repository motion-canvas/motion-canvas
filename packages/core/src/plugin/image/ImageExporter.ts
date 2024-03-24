import type {Exporter, Logger, Project, RendererSettings} from '../../app';
import {FileTypes} from '../../app/presets';
import {EventDispatcher} from '../../events';
import {
  BoolMetaField,
  EnumMetaField,
  MetaOption,
  NumberMetaField,
  ObjectMetaField,
  ValueOf,
} from '../../meta';
import {clamp} from '../../tweening';
import {CanvasOutputMimeType} from '../../types';
import {FrameMetaData, exportBlob} from './common';
import workerUrl from './worker?url';

const EXPORT_RETRY_DELAY = 100;

type ImageExporterOptions = ValueOf<ReturnType<typeof ImageExporter.meta>>;

interface ServerResponse {
  frame: number;
}

enum ExportStrategy {
  Blob,
  WorkerBlob,
  DataUrl,
}

const ExportStrategies: MetaOption<ExportStrategy>[] = [
  {value: ExportStrategy.Blob, text: 'toBlob'},
  {value: ExportStrategy.WorkerBlob, text: 'toBlob (Web Worker)'},
  {value: ExportStrategy.DataUrl, text: 'toDataUrl'},
];

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
      strategy: new EnumMetaField(
        'export strategy',
        ExportStrategies,
        ExportStrategy.Blob,
      ).describe(
        'The strategy used to export the frames. Different strategies may perform better depending on the complexity of your animation and the browser.',
      ),
      ioQueueLimit: new NumberMetaField('I/O queue limit', 256).describe(
        'The maximum number of frames being sent to the server at the same time.',
      ),
      blobQueueLimit: new NumberMetaField('blob queue limit', 64).describe(
        'The maximum number of "toBlob" operations allowed at the same time.',
      ),
    });

    meta.fileType.onChanged.subscribe(value => {
      meta.quality.disable(value === 'image/png');
    });

    meta.strategy.onChanged.subscribe(value => {
      meta.blobQueueLimit.disable(value === ExportStrategy.DataUrl);
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

  private readonly ioQueue = new Set<number>();
  private readonly blobQueue = new Set<number>();
  private readonly projectName: string;
  private readonly quality: number;
  private readonly fileType: CanvasOutputMimeType;
  private readonly groupByScene: boolean;
  private readonly strategy: ExportStrategy;
  private readonly ioQueueLimit: number;
  private readonly blobQueueLimit: number;

  private worker: Worker | null = null;
  private error: string | null = null;

  public constructor(
    private readonly logger: Logger,
    private readonly settings: RendererSettings,
  ) {
    const options = settings.exporter.options as ImageExporterOptions;
    this.projectName = settings.name;
    this.quality = clamp(0, 1, options.quality / 100);
    this.fileType = options.fileType;
    this.groupByScene = options.groupByScene;
    this.ioQueueLimit = options.ioQueueLimit;
    this.blobQueueLimit = options.blobQueueLimit;
    this.strategy = options.strategy;
  }

  public async start() {
    ImageExporter.response.subscribe(this.handleResponse);
    if (this.strategy === ExportStrategy.WorkerBlob) {
      this.worker = new Worker(workerUrl, {type: 'module'});
      this.worker.onmessage = ({data}) => {
        this.handleResponse(data);
      };
      this.worker.onerror = event => {
        this.error = event.message ?? 'Unknown worker error.';
      };
    }
  }

  public async handleFrame(
    canvas: HTMLCanvasElement,
    frame: number,
    sceneFrame: number,
    sceneName: string,
    signal: AbortSignal,
  ) {
    if (this.ioQueue.has(frame)) {
      this.logger.warn(`Frame no. ${frame} is already being exported.`);
      return;
    }
    if (import.meta.hot) {
      while (
        this.ioQueue.size > this.ioQueueLimit ||
        this.blobQueue.size > this.blobQueueLimit
      ) {
        await new Promise(resolve => setTimeout(resolve, EXPORT_RETRY_DELAY));
        if (signal.aborted) {
          return;
        }
      }

      if (this.error) {
        throw new Error(this.error);
      }

      const meta: FrameMetaData = {
        frame,
        mimeType: this.fileType,
        subDirectories: this.groupByScene
          ? [this.projectName, sceneName]
          : [this.projectName],
        name: (this.groupByScene ? sceneFrame : frame)
          .toString()
          .padStart(6, '0'),
      };

      this.ioQueue.add(frame);
      if (this.strategy === ExportStrategy.DataUrl) {
        import.meta.hot!.send('motion-canvas:export', {
          ...meta,
          data: canvas.toDataURL(this.fileType, this.quality),
        });
      } else {
        this.blobQueue.add(frame);
        canvas.toBlob(
          blob => {
            this.blobQueue.delete(frame);
            if (!blob || signal.aborted || this.error !== null) {
              this.ioQueue.delete(frame);
              if (!blob) {
                this.error = `Could not export the Blob for frame no. ${frame}.`;
              }
              return;
            }

            if (this.worker) {
              this.worker.postMessage({meta, blob});
            } else {
              exportBlob({meta, blob});
            }
          },
          this.fileType,
          this.quality,
        );
      }
    }
  }

  public async stop() {
    if (this.error === null) {
      while (this.ioQueue.size > 0) {
        await new Promise(resolve => setTimeout(resolve, EXPORT_RETRY_DELAY));
      }
    }

    ImageExporter.response.unsubscribe(this.handleResponse);
    this.worker?.terminate();
  }

  private handleResponse = ({frame}: ServerResponse) => {
    this.ioQueue.delete(frame);
  };
}
