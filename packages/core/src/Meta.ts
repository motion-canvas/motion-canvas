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

  private source: string | false;

  private constructor(private readonly name: string) {}

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

  private static metaLookup: Record<string, Meta> = {};
  private static sourceLookup: Record<string, Callback> = {};

  static {
    ifHot(hot => {
      hot.on('motion-canvas:meta-ack', ({source}) => {
        this.sourceLookup[source]?.();
      });
    });
  }

  /**
   * Get the {@link Meta} object for the given entity.
   *
   * @param name - The name of the entity the metadata refers to.
   *
   * @typeParam T - The concrete type of the metadata. Depends on the entity.
   *                See {@link SceneMetadata} and {@link ProjectMetadata} for
   *                sample types.
   *
   * @internal
   */
  public static getMetaFor<T extends Metadata = Metadata>(
    name: string,
  ): Meta<T> {
    this.metaLookup[name] ??= new Meta<T>(name);
    return <Meta<T>>this.metaLookup[name];
  }

  /**
   * Register a new version of metadata.
   *
   * @remarks
   * Called directly by meta files themselves.
   * Occurs during the initial load as well as during hot reloads.
   *
   * @param name - The Name of the entity this metadata refers to.
   * @param source - The absolute path to the source file.
   * @param rawData - New metadata as JSON.
   *
   * @internal
   */
  public static register(
    name: string,
    source: string | false,
    rawData: string,
  ) {
    const meta = Meta.getMetaFor(name);
    meta.source = source;

    try {
      const data: Metadata = JSON.parse(rawData);
      data.version ||= META_VERSION;
      meta.data.current = data;
    } catch (e) {
      console.error(`Error when parsing ${source}:`);
      console.error(e);
    }
  }
}
