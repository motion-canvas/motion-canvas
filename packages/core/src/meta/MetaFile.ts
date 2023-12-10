import {Semaphore, useLogger} from '../utils';
import type {MetaField} from './MetaField';

/**
 * Represents the meta file of a given entity.
 *
 * @remarks
 * This class is used exclusively by our Vite plugin as a bridge between
 * physical files and their runtime representation.
 *
 * @typeParam T - The type of the data stored in the meta file.
 *
 * @internal
 */
export class MetaFile<T> {
  private readonly lock = new Semaphore();
  private ignoreChange = false;
  private cache: T | null = null;
  private metaField: MetaField<T> | null = null;

  public constructor(
    private readonly name: string,
    private source: string | false = false,
  ) {}

  public attach(field: MetaField<T>) {
    if (this.metaField) return;
    this.metaField = field;
    if (this.cache) {
      this.metaField.set(this.cache);
    }
    this.metaField?.onChanged.subscribe(this.handleChanged);
  }

  protected handleChanged = async () => {
    if (import.meta.hot && this.metaField && !this.ignoreChange) {
      const data = this.metaField.serialize();
      await this.lock.acquire();
      try {
        // TODO Consider debouncing saving the meta file.
        await this.saveData(data);
      } catch (e: any) {
        useLogger().error(e);
      }
      this.lock.release();
    }
  };

  private async saveData(data: T) {
    if (this.source === false) {
      return;
    }

    if (!this.source) {
      throw new Error(`The meta file for ${this.name} is missing.`);
    }

    if (MetaFile.sourceLookup[this.source]) {
      throw new Error(`Metadata for ${this.name} is already being updated`);
    }

    const source = this.source;
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        delete MetaFile.sourceLookup[source];
        reject(`Connection timeout when updating metadata for ${this.name}`);
      }, 1000);
      MetaFile.sourceLookup[source] = () => {
        delete MetaFile.sourceLookup[source];
        resolve();
      };
      import.meta.hot!.send('motion-canvas:meta', {
        source,
        data,
      });
    });
  }

  /**
   * Load new metadata from a file.
   *
   * @remarks
   * This method is called during hot module replacement.
   *
   * @param data - New metadata.
   */
  public loadData(data: T) {
    this.ignoreChange = true;
    this.cache = data;
    this.metaField?.set(data);
    this.ignoreChange = false;
  }

  private static sourceLookup: Record<string, Callback> = {};

  static {
    if (import.meta.hot) {
      import.meta.hot.on('motion-canvas:meta-ack', ({source}) => {
        this.sourceLookup[source]?.();
      });
    }
  }
}
