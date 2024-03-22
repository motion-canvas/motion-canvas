import type {Exporter, Logger, RendererSettings} from '../../app';
import {EventDispatcher} from '../../events';
import {clamp} from '../../tweening';
import {CanvasOutputMimeType} from '../../types';
import {EXPORT_RETRY_DELAY, ImageExporterOptions} from './ImageExporter';

interface ServerResponse {
  frame: number;
}

/**
 * Image sequence exporter running on the main thread.
 *
 * @internal
 */
export class SingleThreadedExporter implements Exporter {
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
  private readonly concurrentLimit: number;

  public constructor(
    private readonly logger: Logger,
    private readonly settings: RendererSettings,
  ) {
    const options = settings.exporter.options as ImageExporterOptions;
    this.projectName = settings.name;
    this.quality = clamp(0, 1, options.quality / 100);
    this.fileType = options.fileType;
    this.groupByScene = options.groupByScene;
    this.concurrentLimit = options.concurrentLimit;
  }

  public async start() {
    SingleThreadedExporter.response.subscribe(this.handleResponse);
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
      while (this.frameLookup.size > this.concurrentLimit) {
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
    SingleThreadedExporter.response.unsubscribe(this.handleResponse);
  }

  private handleResponse = ({frame}: ServerResponse) => {
    this.frameLookup.delete(frame);
  };
}
