import {
  ColorMetaField,
  EnumMetaField,
  ExporterMetaField,
  MetaField,
  NumberMetaField,
  ObjectMetaField,
  RangeMetaField,
  Vector2MetaField,
} from '../meta';
import {CanvasColorSpace, Color, Vector2} from '../types';
import {ColorSpaces, FrameRates, Scales} from './presets';
import type {Project} from './Project';

function createProjectMetadata(project: Project) {
  const meta = {
    version: new MetaField('version', 1),
    shared: new ObjectMetaField('General', {
      background: new ColorMetaField('background', null),
      range: new RangeMetaField('range', [0, Infinity]),
      size: new Vector2MetaField('resolution', new Vector2(1920, 1080)),
      audioOffset: new NumberMetaField('audio offset', 0),
    }),
    preview: new ObjectMetaField('Preview', {
      fps: new NumberMetaField('frame rate', 30)
        .setPresets(FrameRates)
        .setRange(1),
      resolutionScale: new EnumMetaField('scale', Scales, 1),
    }),
    rendering: new ObjectMetaField('Rendering', {
      fps: new NumberMetaField('frame rate', 60)
        .setPresets(FrameRates)
        .setRange(1),
      resolutionScale: new EnumMetaField('scale', Scales, 1),
      colorSpace: new EnumMetaField('color space', ColorSpaces),
      exporter: new ExporterMetaField('exporter', project),
    }),
  };

  meta.shared.audioOffset.disable(!project.audio);

  return meta;
}

export class ProjectMetadata extends ObjectMetaField<
  ReturnType<typeof createProjectMetadata>
> {
  public constructor(project: Project) {
    super('project', createProjectMetadata(project));
  }

  public getFullPreviewSettings(): {
    fps: number;
    resolutionScale: number;
    background: Color | null;
    range: [number, number];
    size: Vector2;
    audioOffset: number;
  } {
    return {
      ...this.shared.get(),
      ...this.preview.get(),
    };
  }

  public getFullRenderingSettings(): {
    fps: number;
    resolutionScale: number;
    colorSpace: CanvasColorSpace;
    background: Color | null;
    range: [number, number];
    size: Vector2;
    audioOffset: number;
    exporter: {
      name: string;
      options: unknown;
    };
  } {
    return {
      ...this.shared.get(),
      ...this.rendering.get(),
    };
  }
}
