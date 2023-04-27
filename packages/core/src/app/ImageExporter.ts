import {CanvasOutputMimeType} from '../types';
import {Exporter} from './Exporter';
import {Logger} from './Logger';
import {RendererSettings} from './Renderer';
import {
  BoolMetaField,
  EnumMetaField,
  NumberMetaField,
  ObjectMetaField,
  ValueOf,
} from '../meta';
import {clamp} from '../tweening';
import {FileTypes} from './presets';

const EXPORT_FRAME_LIMIT = 256;
const EXPORT_RETRY_DELAY = 1000;

type ImageExporterOptions = ValueOf<ReturnType<ImageExporter['meta']>>;

/**
 * Image sequence exporter.
 */
export class ImageExporter implements Exporter {
  public readonly name = 'image sequence';

  private readonly frameLookup = new Map<number, Callback>();
  private frameCounter = 0;
  private projectName = 'unknown';
  private quality = 1;
  private fileType: CanvasOutputMimeType = 'image/png';
  private groupByScene = false;

  public constructor(private readonly logger: Logger) {
    if (import.meta.hot) {
      import.meta.hot.on('motion-canvas:export-ack', ({frame}) => {
        this.frameLookup.get(frame)?.();
      });
    }
  }

  public meta() {
    const meta = new ObjectMetaField(this.name, {
      fileType: new EnumMetaField('file type', FileTypes),
      quality: new NumberMetaField('quality', 100).setRange(0, 100),
      groupByScene: new BoolMetaField('group by scene', false),
    });

    meta.fileType.onChanged.subscribe(value => {
      meta.quality.disable(value === 'image/png');
    });

    return meta;
  }

  public async configure(settings: RendererSettings) {
    const options = settings.exporter.options as ImageExporterOptions;
    this.projectName = settings.name;
    this.quality = clamp(0, 1, options.quality / 100);
    this.fileType = options.fileType;
    this.groupByScene = options.groupByScene;
  }

  public async start() {
    this.frameLookup.clear();
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
      while (this.frameCounter > EXPORT_FRAME_LIMIT) {
        await new Promise(resolve => setTimeout(resolve, EXPORT_RETRY_DELAY));
        if (signal.aborted) {
          return;
        }
      }

      this.frameCounter++;
      this.frameLookup.set(frame, () => {
        this.frameCounter--;
        this.frameLookup.delete(frame);
      });

      import.meta.hot!.send('motion-canvas:export', {
        frame,
        sceneFrame,
        data: canvas.toDataURL(this.fileType, this.quality),
        mimeType: this.fileType,
        subDirectories: this.groupByScene
          ? [this.projectName, sceneName]
          : [this.projectName],
        groupByScene: this.groupByScene,
      });
    }
  }

  public async stop() {
    while (this.frameCounter > 0) {
      await new Promise(resolve => setTimeout(resolve, EXPORT_RETRY_DELAY));
    }
  }
}
