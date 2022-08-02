import {ValueDispatcher} from './events';

/**
 * Represents the contents of a meta file.
 */
export interface Metadata {
  version: number;
}

/**
 * Represents the meta file of a given entity.
 *
 * @template T Type of the data stored in the meta file.
 */
export class Meta<T extends Metadata = Metadata> {
  /**
   * Triggered when metadata changes.
   *
   * @event T
   */
  public get onDataChanged() {
    return this.data.subscribable;
  }
  private readonly data = new ValueDispatcher(<T>{version: META_VERSION});

  private rawData: string;
  private source: string;

  private constructor(private readonly name: string) {
    this.rawData = JSON.stringify(this.data.current, undefined, 2);
  }

  public getData() {
    return this.data.current;
  }

  /**
   * Set data without waiting for confirmation.
   *
   * Any possible errors will be logged to the console.
   *
   * @param data
   */
  public setDataSync(data: Partial<T>) {
    this.setData(data).catch(console.error);
  }

  public async setData(data: Partial<T>) {
    this.data.current = {
      ...this.data.current,
      ...data,
    };
    this.rawData = JSON.stringify(this.data.current, undefined, 2);
    if (this.source) {
      const response = await fetch(`/meta/${this.source}`, {
        method: 'POST',
        body: this.rawData,
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
    } else {
      console.warn(
        `The meta file for ${this.name} is missing\n`,
        `Make sure the file containing your scene is called "${this.name}.ts to match the generator function name`,
      );
    }
  }

  private static metaLookup: Record<string, Meta> = {};

  /**
   * Get the {@link Meta} object for the given entity.
   *
   * @param name Name of the entity the metadata refers to.
   * @template T Concrete type of the metadata. Depends on the entity.
   *           See {@link SceneMetadata} and {@link ProjectMetadata} for sample
   *           types.
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
   * Called directly by meta files themselves.
   * Occurs during the initial load as well as during hot reloads.
   *
   * @param name Name of the entity this metadata refers to.
   * @param source Path to the source file relative to the compilation context.
   * @param rawData New metadata as JSON.
   *
   * @internal
   */
  public static register(name: string, source: string, rawData: string) {
    const meta = Meta.getMetaFor(name);
    meta.source = source;

    if (meta.rawData === rawData) {
      return;
    }

    try {
      const data: Metadata = JSON.parse(rawData);
      data.version ??= META_VERSION;
      meta.data.current = data;
      meta.rawData = rawData;
    } catch (e) {
      console.error(`Error when parsing ${decodeURIComponent(source)}:`);
      console.error(e);
    }
  }
}
