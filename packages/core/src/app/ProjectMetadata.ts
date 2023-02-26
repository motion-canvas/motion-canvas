import {
  ColorMetaField,
  MetaField,
  ObjectMetaField,
  RangeMetaField,
  Vector2MetaField,
} from '../meta';
import {CanvasColorSpace, Color, CanvasOutputMimeType, Vector2} from '../types';

function createProjectMetadata() {
  return {
    version: new MetaField('version', 1),
    shared: new ObjectMetaField('shared', {
      background: new ColorMetaField('background', null),
      range: new RangeMetaField('range', [0, Infinity]),
      size: new Vector2MetaField('size', new Vector2(1920, 1080)),
      audioOffset: new MetaField('audioOffset', 0),
    }),
    preview: new ObjectMetaField('preview', {
      fps: new MetaField('fps', 30),
      resolutionScale: new MetaField('scale', 1),
    }),
    rendering: new ObjectMetaField('rendering', {
      fps: new MetaField('fps', 60),
      resolutionScale: new MetaField('scale', 2),
      colorSpace: new MetaField('color space', 'srgb' as CanvasColorSpace),
      fileType: new MetaField('file type', 'image/png' as CanvasOutputMimeType),
      quality: new MetaField('quality', 1),
    }),
  };
}

export class ProjectMetadata extends ObjectMetaField<
  ReturnType<typeof createProjectMetadata>
> {
  public constructor() {
    super('project', createProjectMetadata());
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
  } {
    return {
      ...this.shared.get(),
      ...this.rendering.get(),
    };
  }
}
