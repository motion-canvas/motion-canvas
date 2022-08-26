import {ValueDispatcher} from './events';
import {ifHot} from './utils';

const META_VERSION = 1;

/**
 * Represents the contents of a meta file.
 */
export interface Metadata {
  version: number;
}

/**
 * Represents the meta file of a given entity.
 *
 * @typeParam T - The type of the data stored in the meta file.
 */
export class Meta<T extends Metadata = Metadata> {
  /**
   * Triggered when metadata changes.
   *
   * @eventProperty
   */
  public get onDataChanged() {
    return this.data.subscribable;
  }
  private readonly data = new ValueDispatcher(<T>{version: META_VERSION});

  public constructor(
    private readonly name: string,
    private source: string | false = false,
  ) {}

  public getData() {
    return this.data.current;
  }

  /**
   * Set data without waiting for confirmation.
   *
   * @remarks
   * Any possible errors will be logged to the console.
   *
   * @param data - New data.
   */
  public setDataSync(data: Partial<T>) {
    this.setData(data).catch(console.error);
  }

  public async setData(data: Partial<T>) {
    this.data.current = {
      ...this.data.current,
      ...data,
    };
    await ifHot(async hot => {
      if (this.source === false) {
        return;
      }

      if (!this.source) {
        console.warn(
          `The meta file for ${this.name} is missing\n`,
          `Make sure the file containing your scene is called "${this.name}.ts" to match the generator function name`,
        );
        return;
      }

      if (Meta.sourceLookup[this.source]) {
        console.warn(`Metadata for ${this.name} is already being updated`);
        return;
      }

      const source = this.source;
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          delete Meta.sourceLookup[source];
          reject(`Connection timeout when updating metadata for ${this.name}`);
        }, 1000);
        Meta.sourceLookup[source] = () => {
          delete Meta.sourceLookup[source];
          resolve();
        };
        hot.send('motion-canvas:meta', {
          source,
          data: this.data.current,
        });
      });
    });
  }

  /**
   * Load new metadata from a file.
   *
   * @param data - New metadata.
   */
  public async loadData(data: T) {
    data.version ||= META_VERSION;
    this.data.current = data;
  }

  private static sourceLookup: Record<string, Callback> = {};

  static {
    ifHot(hot => {
      hot.on('motion-canvas:meta-ack', ({source}) => {
        this.sourceLookup[source]?.();
      });
    });
  }
}
