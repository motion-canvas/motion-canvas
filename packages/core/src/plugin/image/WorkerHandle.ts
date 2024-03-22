import {Vector2} from '../../types';
import {FrameMetadata, WorkerRequest, WorkerResponse} from './types';

/**
 * A handle to the underlying web worker used to export frames.
 */
export class WorkerHandle {
  private readonly worker: Worker;
  public error: string | null = null;

  public constructor(
    private readonly freeQueue: Set<WorkerHandle>,
    private readonly frames: Set<number>,
    size: Vector2,
  ) {
    this.worker = new Worker(new URL('./worker', import.meta.url), {
      type: 'module',
    });
    this.worker.onmessage = this.handleMessage;
    this.worker.onerror = this.handleError;
    this.postMessage({
      type: 'configure',
      width: size.x,
      height: size.y,
    });
  }

  public exportFrame(bitmap: ImageBitmap, metadata: FrameMetadata) {
    if (!this.freeQueue.has(this)) {
      throw new Error(
        `Could not export frame ${metadata.frame}: web worker is busy.`,
      );
    }
    this.frames.add(metadata.frame);
    this.freeQueue.delete(this);
    this.postMessage({type: 'extract', bitmap, metadata});
  }

  public terminate() {
    this.worker.terminate();
  }

  private postMessage(message: WorkerRequest) {
    this.worker.postMessage(message);
  }

  private handleMessage = (event: MessageEvent<WorkerResponse>) => {
    const {data} = event;
    switch (data.type) {
      case 'extracted':
        this.freeQueue.add(this);
        break;
      case 'stored':
        this.frames.delete(data.frame);
        break;
      case 'configured':
        this.freeQueue.add(this);
        break;
    }
  };

  private handleError = (event: ErrorEvent) => {
    this.error = event.message ?? 'An unknown error occurred.';
    this.freeQueue.add(this);
  };
}
