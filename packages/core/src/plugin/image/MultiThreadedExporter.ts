import type {Exporter, Logger, RendererSettings} from '../../app';
import {clamp} from '../../tweening';
import {CanvasOutputMimeType, Vector2} from '../../types';
import {DetailedError, range} from '../../utils';
import {EXPORT_RETRY_DELAY, ImageExporterOptions} from './ImageExporter';
import {WorkerHandle} from './WorkerHandle';

/**
 * Image sequence exporter utilizing multiple parallel web workers.
 *
 * @internal
 */
export class MultiThreadedExporter implements Exporter {
  private readonly frameLookup = new Set<number>();
  private readonly projectName: string;
  private readonly quality: number;
  private readonly fileType: CanvasOutputMimeType;
  private readonly groupByScene: boolean;
  private readonly workerCount: number;
  private readonly concurrentLimit: number;
  private readonly freeWorkers = new Set<WorkerHandle>();
  private readonly size: Vector2;
  private workers: WorkerHandle[] = [];

  public constructor(
    private readonly logger: Logger,
    private readonly settings: RendererSettings,
  ) {
    const options = settings.exporter.options as ImageExporterOptions;
    this.projectName = settings.name;
    this.size = settings.size.scale(settings.resolutionScale);
    this.quality = clamp(0, 1, options.quality / 100);
    this.fileType = options.fileType;
    this.groupByScene = options.groupByScene;
    this.workerCount = options.workerCount;
    this.concurrentLimit = options.concurrentLimit;
  }

  public async start() {
    this.workers = range(this.workerCount).map(
      () => new WorkerHandle(this.freeWorkers, this.frameLookup, this.size),
    );
  }

  public async handleFrame(
    canvas: HTMLCanvasElement,
    frame: number,
    sceneFrame: number,
    sceneName: string,
    signal: AbortSignal,
  ) {
    if (import.meta.hot) {
      const bitmap = await createImageBitmap(canvas);

      while (
        this.freeWorkers.size === 0 ||
        this.frameLookup.size >= this.concurrentLimit
      ) {
        await new Promise(resolve => setTimeout(resolve, EXPORT_RETRY_DELAY));
        if (signal.aborted) {
          return;
        }
      }

      this.frameLookup.add(frame);
      const worker: WorkerHandle = this.freeWorkers.values().next().value;
      if (worker.error) {
        throw new DetailedError(
          `Export worker error: ${worker.error}`,
          'You can disable web workers by setting the worker count to zero in the video settings.',
        );
      }

      worker.exportFrame(bitmap, {
        frame,
        quality: this.quality,
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
    while (this.freeWorkers.size < this.workers.length) {
      await new Promise(resolve => setTimeout(resolve, EXPORT_RETRY_DELAY));
    }
    for (const worker of this.workers) {
      worker.terminate();
    }
  }
}
