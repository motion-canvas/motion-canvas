import {CanvasOutputMimeType} from '../types';
import {Exporter} from './Exporter';
import {Logger} from './Logger';
import {RendererSettings} from './Renderer';

const EXPORT_FRAME_LIMIT = 256;
const EXPORT_RETRY_DELAY = 1000;

/**
 * Image sequence exporter.
 */
export class ImageExporter implements Exporter {
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

  public async configure(settings: RendererSettings) {
    this.projectName = settings.name;
    this.quality = settings.quality;
    this.fileType = settings.fileType;
    this.groupByScene = settings.groupByScene;
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
