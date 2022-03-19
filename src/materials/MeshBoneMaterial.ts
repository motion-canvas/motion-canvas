import {
  MaterialParameters,
  ShaderLib,
  ShaderMaterial,
  Texture,
  Vector4,
} from 'three';

import fragmentShader from 'MC/shaders/bone_highlight_fragment.glsl';
import vertexShader from 'MC/shaders/bone_highlight_vertex.glsl';

export interface MeshBoneMaterialParameters extends MaterialParameters {
  highlight?: number;
  map?: Texture;
  wireframe?: boolean;
  highlightColor?: Vector4;
}

export class MeshBoneMaterial extends ShaderMaterial {
  public set map(value: Texture) {
    if (value) {
      this.uniforms.map = {value};
    } else {
      delete this.uniforms.map;
    }
  }

  public get map(): Texture {
    return this.uniforms.map?.value ?? null;
  }

  public set highlight(value: number | null) {
    this.uniforms.highlight = {value: value ?? -1};
  }

  public get highlight(): number | null {
    return this.uniforms.highlight?.value === -1
      ? null
      : this.uniforms.highlight?.value;
  }

  public set highlightColor(value: Vector4) {
    this.uniforms.highlightDiffuse = {value};
  }

  public get highlightColor(): Vector4 {
    return this.uniforms.highlightDiffuse?.value;
  }

  public set transparency(value: number) {
    this.uniforms.opacity.value = value;
  }

  public get transparency(): number {
    return this.uniforms.opacity.value;
  }

  public set wireframeOverlay(value: boolean) {
    if (value) {
      this.defines.USE_WIREFRAME = {value: true};
    } else {
      delete this.defines.USE_WIREFRAME;
    }
  }

  public get wireframeOverlay(): boolean {
    return !!this.defines.USE_WIREFRAME;
  }

  public constructor(parameters: MeshBoneMaterialParameters = {}) {
    const {map, highlight, highlightColor, opacity, wireframe, ...rest} =
      parameters;
    super({
      ...rest,
      fragmentShader,
      vertexShader,
    });

    this.uniforms = {...ShaderLib.basic.uniforms};
    this.map = map;
    this.highlight = highlight;
    this.highlightColor = highlightColor ?? new Vector4(0, 0, 0, 0);
    this.transparency = opacity;
    this.wireframeOverlay = wireframe;
  }
}
