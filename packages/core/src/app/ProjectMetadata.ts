import {
  BoolMetaField,
  ColorMetaField,
  EnumMetaField,
  MetaField,
  NumberMetaField,
  ObjectMetaField,
  RangeMetaField,
  Vector2MetaField,
} from '../meta';
import {CanvasColorSpace, Color, CanvasOutputMimeType, Vector2} from '../types';
import {ColorSpaces, FileTypes, FrameRates, Scales} from './presets';
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
      fps: new NumberMetaField('frame rate', 30).setPresets(FrameRates),
      resolutionScale: new EnumMetaField('scale', Scales, 1),
    }),
    rendering: new ObjectMetaField('Rendering', {
      fps: new NumberMetaField('frame rate', 60).setPresets(FrameRates),
      resolutionScale: new EnumMetaField('scale', Scales, 1),
      colorSpace: new EnumMetaField('color space', ColorSpaces),
      fileType: new EnumMetaField('file type', FileTypes),
      quality: new NumberMetaField('quality (%)', 100).setRange(0, 100),
      groupByScene: new BoolMetaField('group by scene', false),
    }),
  };

  meta.shared.audioOffset.disable(!project.audio);
  meta.rendering.fileType.onChanged.subscribe(value => {
    meta.rendering.quality.disable(value === 'image/png');
  });

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
    fileType: CanvasOutputMimeType;
    quality: number;
    background: Color | null;
    range: [number, number];
    size: Vector2;
    audioOffset: number;
    groupByScene: boolean;
  } {
    return {
      ...this.shared.get(),
      ...this.rendering.get(),
    };
  }
}
