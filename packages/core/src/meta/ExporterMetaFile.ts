import {MetaField} from './MetaField';
import type {Exporter} from '../app';
import {EnumMetaField} from './EnumMetaField';
import {ValueDispatcher} from '../events';

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

  public get options() {
    return this.optionFields[this.current];
  }

  public get exporter() {
    return this.exporters[this.current];
  }

  private readonly exporterField: EnumMetaField<string>;
  private readonly optionFields: MetaField<unknown>[];

  public constructor(
    name: string,
    public readonly exporters: Exporter[],
    private current = 0,
  ) {
    const optionFields = exporters.map(exporter => exporter.meta());
    const exporterField = new EnumMetaField(
      'exporter',
      exporters.map(exporter => ({
        value: exporter.name,
        text: exporter.name,
      })),
      exporters[current].name,
    );
    super(name, {
      name: exporterField.get(),
      options: optionFields[current].get(),
    });

    this.exporterField = exporterField;
    this.exporterField.onChanged.subscribe(this.handleChange, false);
    this.exporterField.disable(optionFields.length < 2).space();
    this.optionFields = optionFields;
    this.optionFields[current].onChanged.subscribe(this.handleChange, false);
    this.fields = new ValueDispatcher([this.exporterField, this.options]);
  }

  public set(value: {name: string; options: any}) {
    this.exporterField.set(value.name);
    this.options.set(value.options);
  }

  public serialize(): {name: string; options: any} {
    return {
      name: this.exporterField.serialize(),
      options: this.options.serialize(),
    };
  }

  public clone(): this {
    return new (<any>this.constructor)(this.name, this.exporters, this.current);
  }

  private handleChange = () => {
    const value = this.exporterField.get();
    const index = Math.max(
      this.exporters.findIndex(exporter => exporter.name === value),
      0,
    );

    if (this.current !== index) {
      this.options.onChanged.unsubscribe(this.handleChange);
      this.current = index;
      this.options.onChanged.subscribe(this.handleChange, false);
      this.fields.current = [this.exporterField, this.options];
    }

    this.value.current = {
      name: this.exporterField.get(),
      options: this.options.get(),
    };
  };
}
