import {SimpleEventDispatcher} from 'strongly-typed-events';

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
  public get Changed() {
    return this.changed.asEvent();
  }

  private data: T;
  private rawData: string;
  private source: string;
  private changed = new SimpleEventDispatcher<T>();

  private constructor() {
    this.data = <T>{version: META_VERSION};
    this.rawData = JSON.stringify(this.data, undefined, 2);
  }

  public getData(): T {
    return this.data;
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
    this.data = {
      ...this.data,
      ...data,
    };
    this.rawData = JSON.stringify(this.data, undefined, 2);
    this.changed.dispatch(this.data);
    const response = await fetch(`/meta/${this.source}`, {
      method: 'POST',
      body: this.rawData,
    });
    if (!response.ok) {
      throw new Error(response.statusText);
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
    this.metaLookup[name] ??= new Meta<T>();
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
      meta.data = data;
      meta.rawData = rawData;
      meta.changed.dispatch(data);
    } catch (e) {
      console.error(`Error when parsing ${decodeURIComponent(source)}:`);
      console.error(e);
    }
  }
}
