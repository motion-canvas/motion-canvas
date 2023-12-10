import {
  BoolMetaField,
  ColorMetaField,
  MetaField,
  ObjectMetaField,
  Vector2MetaField,
} from '../meta';
import {Color, Vector2} from '../types';

/**
 * Create a runtime representation of the settings metadata.
 */
export function createSettingsMetadata() {
  return new ObjectMetaField('Application Settings', {
    version: new MetaField('version', 1),
    appearance: new ObjectMetaField('Appearance', {
      color: new ColorMetaField('accent color', new Color('#33a6ff')).describe(
        'The accent color for the user interface. (Leave empty to use the default color)',
      ),
      font: new BoolMetaField('legacy font', false).describe(
        "Use the 'JetBrains Mono' font for the user interface.",
      ),
      coordinates: new BoolMetaField('coordinates', true).describe(
        'Display mouse coordinates within the preview window.',
      ),
    }),
    defaults: new ObjectMetaField('Defaults', {
      background: new ColorMetaField('background', null).describe(
        'The default background color used in new projects.',
      ),
      size: new Vector2MetaField(
        'resolution',
        new Vector2(1920, 1080),
      ).describe('The default resolution used in new projects.'),
    }),
  });
}

/**
 * A runtime representation of the settings metadata.
 */
export type SettingsMetadata = ReturnType<typeof createSettingsMetadata>;
