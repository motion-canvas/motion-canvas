import type {ExporterClass, Project} from '../app';
import {ValueDispatcher} from '../events';
import {EnumMetaField} from './EnumMetaField';
import {MetaField} from './MetaField';

/**
 * Represents the exporter configuration.
 */
export class ExporterMetaField extends MetaField<{
  name: string;
  options: unknown;
}> {
  public readonly type = Object;

  /**
   * Triggered when the nested fields change.
   *
   * @eventProperty
   */
  public get onFieldsChanged() {
    return this.fields.subscribable;
  }
  private readonly fields: ValueDispatcher<MetaField<any>[]>;

  public get options(): MetaField<any> | undefined {
    return this.optionFields[this.current];
  }

  private readonly exporterField: EnumMetaField<string>;
  private readonly optionFields: MetaField<unknown>[];
  public readonly exporters: ExporterClass[];

  public constructor(
    name: string,
    project: Project,
    private current = 0,
  ) {
    const exporters = project.plugins.flatMap(
      plugin => plugin.exporters?.(project) ?? [],
    );
    const optionFields = exporters.map(exporter => exporter.meta(project));
    const exporterField = new EnumMetaField(
      'exporter',
      exporters.map(exporter => ({
        value: exporter.id,
        text: exporter.displayName,
      })),
      exporters[current]?.id,
    );

    super(name, {
      name: exporterField.get(),
      options: optionFields[current]?.get(),
    });

    this.exporters = exporters;
    this.exporterField = exporterField;
    this.exporterField.onChanged.subscribe(this.handleChange, false);
    this.exporterField.disable(optionFields.length < 2).space();
    this.optionFields = optionFields;
    this.fields = new ValueDispatcher([this.exporterField as MetaField<any>]);

    if (this.options) {
      this.options.onChanged.subscribe(this.handleChange, false);
      this.fields.current = [this.exporterField, this.options];
    }
  }

  public set(value: {name: string; options: any}) {
    this.exporterField.set(value.name);
    this.options?.set(value.options ?? {});
  }

  public serialize(): {name: string; options: any} {
    return {
      name: this.exporterField.serialize(),
      options: this.options?.serialize() ?? null,
    };
  }

  public clone(): this {
    return new (<any>this.constructor)(this.name, this.exporters, this.current);
  }

  private handleChange = () => {
    const value = this.exporterField.get();
    const index = Math.max(
      this.exporters.findIndex(exporter => exporter.id === value),
      0,
    );

    if (this.current !== index) {
      this.options?.onChanged.unsubscribe(this.handleChange);
      this.current = index;
      this.options?.onChanged.subscribe(this.handleChange, false);
      this.fields.current = this.options
        ? [this.exporterField, this.options]
        : [this.exporterField];
    }

    this.value.current = {
      name: this.exporterField.get(),
      options: this.options?.get() ?? null,
    };
  };
}
