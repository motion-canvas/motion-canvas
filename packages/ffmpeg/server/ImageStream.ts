import {Readable} from 'stream';

type QueueItem =
  | {
      type: 'frame';
      array: Uint8Array;
      finished: boolean;
    }
  | {
      type: 'end';
    };

export class ImageStream extends Readable {
  private queue: QueueItem[] = [];

  public constructor(private size: {x: number; y: number}) {
    super();
  }

  public async pushImage(readable: Readable | null) {
    if (readable) {
      const length = this.size.x * this.size.y * 4;
      const item: QueueItem = {
        type: 'frame',
        array: new Uint8Array(length),
        finished: false,
      };
      this.queue.push(item);

      let pointer = 0;
      readable.on('data', (chunk: Uint8Array) => {
        item.array.set(chunk, pointer);
        pointer += chunk.length;
      });

      await new Promise((resolve, reject) => {
        readable.on('end', resolve).on('error', reject);
      });

      item.finished = true;
    } else {
      this.queue.push({type: 'end'});
    }

    this._read();
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public override _read() {
    while (this.queue.length > 0) {
      const item = this.queue[0];
      if (item.type === 'end') {
        this.queue = [];
        this.push(null);
        return;
      }

      if (!item.finished) {
        return;
      }

      this.queue.shift();
      this.push(item.array);
    }
  }
}
