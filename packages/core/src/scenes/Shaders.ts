import {SharedWebGLContext, WebGLContextOwner} from '../app/SharedWebGLContext';
import {Scene} from './Scene';

/**
 * @internal
 */
export const UNIFORM_RESOLUTION = 'resolution';
/**
 * @internal
 */
export const UNIFORM_DESTINATION_TEXTURE = 'destinationTexture';
/**
 * @internal
 */
export const UNIFORM_SOURCE_TEXTURE = 'sourceTexture';
/**
 * @internal
 */
export const UNIFORM_TIME = 'time';
/**
 * @internal
 */
export const UNIFORM_DELTA_TIME = 'deltaTime';
/**
 * @internal
 */
export const UNIFORM_FRAMERATE = 'framerate';
/**
 * @internal
 */
export const UNIFORM_FRAME = 'frame';
/**
 * @internal
 */
export const UNIFORM_SOURCE_MATRIX = 'sourceMatrix';
/**
 * @internal
 */
export const UNIFORM_DESTINATION_MATRIX = 'destinationMatrix';

// language=glsl
const FragmentShader = `\
#version 300 es

in vec2 position;

out vec2 screenUV;
out vec2 sourceUV;
out vec2 destinationUV;

uniform mat4 sourceMatrix;
uniform mat4 destinationMatrix;

void main() {
    vec2 position_source = position * 0.5 + 0.5;
    vec4 position_screen = sourceMatrix * vec4(position_source, 0, 1);

    screenUV = position_screen.xy;
    sourceUV = position_source;
    destinationUV = (destinationMatrix * position_screen).xy;

    gl_Position = (position_screen - 0.5) * 2.0;
}
`;

/**
 * @internal
 */
export class Shaders implements WebGLContextOwner {
  private gl: WebGL2RenderingContext | null = null;
  private positionBuffer: WebGLBuffer | null = null;
  private sourceTexture: WebGLTexture | null = null;
  private destinationTexture: WebGLTexture | null = null;
  private positionLocation = 0;
  private readonly quadPositions = new Float32Array([
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, -1.0,
  ]);

  public constructor(
    private readonly scene: Scene,
    private readonly sharedContext: SharedWebGLContext,
  ) {
    scene.onReloaded.subscribe(this.handleReload);
  }

  public setup(gl: WebGL2RenderingContext): void {
    this.gl = gl;
    this.updateViewport();
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.quadPositions, gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.positionLocation);

    this.sourceTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.sourceTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.destinationTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.destinationTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  public teardown(gl: WebGL2RenderingContext): void {
    gl.deleteBuffer(this.positionBuffer);
    gl.disableVertexAttribArray(this.positionLocation);
    gl.deleteTexture(this.sourceTexture);
    gl.deleteTexture(this.destinationTexture);
    this.positionBuffer = null;
    this.sourceTexture = null;
    this.destinationTexture = null;
    this.gl = null;
  }

  private handleReload = () => {
    if (this.gl) {
      this.updateViewport();
    }
  };

  private updateViewport() {
    if (this.gl) {
      const size = this.scene.getRealSize();
      this.gl.canvas.width = size.width;
      this.gl.canvas.height = size.height;
      this.gl.viewport(0, 0, size.width, size.height);
    }
  }

  public getGL() {
    return this.gl ?? this.sharedContext.borrow(this);
  }

  public getProgram(fragment: string) {
    const program = this.sharedContext.getProgram(fragment, FragmentShader);
    if (!program) {
      return null;
    }

    const size = this.scene.getRealSize();
    const gl = this.getGL();
    gl.useProgram(program);
    gl.uniform1i(gl.getUniformLocation(program, UNIFORM_SOURCE_TEXTURE), 0);
    gl.uniform1i(
      gl.getUniformLocation(program, UNIFORM_DESTINATION_TEXTURE),
      1,
    );
    gl.uniform2f(
      gl.getUniformLocation(program, UNIFORM_RESOLUTION),
      size.x,
      size.y,
    );
    gl.uniform1f(
      gl.getUniformLocation(program, UNIFORM_DELTA_TIME),
      this.scene.playback.deltaTime,
    );
    gl.uniform1f(
      gl.getUniformLocation(program, UNIFORM_FRAMERATE),
      this.scene.playback.fps,
    );

    return program;
  }

  public copyTextures(destination: TexImageSource, source: TexImageSource) {
    this.copyTexture(source, this.sourceTexture!);
    this.copyTexture(destination, this.destinationTexture!);
  }

  public clear() {
    const gl = this.getGL();
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  public render() {
    const gl = this.getGL();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  private copyTexture(source: TexImageSource, texture: WebGLTexture) {
    const gl = this.getGL();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.generateMipmap(gl.TEXTURE_2D);
  }
}
