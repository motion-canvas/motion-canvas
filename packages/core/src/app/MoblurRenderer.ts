import {Vector2} from '../types';
import * as WebGL from '../utils/webGLHelpers';

import vertexShaderSrc from '../../shaders/basicVertex.glsl?raw';
import moblurShaderSrc from '../../shaders/moblur.glsl?raw';
import {PlaybackManager} from './PlaybackManager';

type Texture = {texture: WebGLTexture; readonly location: number};

export class MoblurRenderer {
  private static readonly vertexPositions = [
    -1, 1, 1, 1, -1, -1, -1, -1, 1, 1, 1, -1,
  ];

  public static checkSupport(): boolean {
    const canvas = new OffscreenCanvas(10, 10);

    if (!canvas) {
      console.warn(
        'Error creating Offscreen Canvas. Motion blur effect disabled',
      );
      return false;
    }

    const context = canvas.getContext('webgl2');

    if (!context) {
      console.warn(
        'Error creating WebGL2 context. Motion blur effect disabled',
      );
      return false;
    }

    return true;
  }

  private readonly computeContext: WebGL2RenderingContext;
  private readonly sumTexture: Texture;
  private readonly sampleCountUniformLoc: WebGLUniformLocation;
  private sampleCount: number = 1;

  public constructor(size: Vector2, samples: number) {
    const computeBuffer = new OffscreenCanvas(size.x, size.y);
    const computeContext = computeBuffer?.getContext('webgl2');

    if (!computeContext) {
      throw new Error(
        'Error creating MoblurRenderer. Use "MoblurRenderer.checkSupport()" before calling constructor',
      );
    }

    this.computeContext = computeContext;
    this.sampleCount = samples;

    const gl = this.computeContext;
    const vertexShader = WebGL.compileShader(
      gl,
      gl.VERTEX_SHADER,
      vertexShaderSrc,
    )!;
    const moblurFS = WebGL.compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      moblurShaderSrc,
    )!;
    const program = WebGL.compileProgram(gl, vertexShader, moblurFS)!;
    const divSrcUniformLoc = gl.getUniformLocation(program, 'srcTex')!;
    this.sampleCountUniformLoc = gl.getUniformLocation(program, 'samples')!;
    this.sumTexture = this.getSumTexture(gl, 2);
    this.setupVertexBuffer(gl, program);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.uniform1i(divSrcUniformLoc, this.sumTexture.location);
    gl.uniform1i(this.sampleCountUniformLoc, this.sampleCount);
    console.log('Initial samples', this.sampleCount);
  }

  private setupVertexBuffer(gl: WebGL2RenderingContext, program: WebGLProgram) {
    const positionBuffer = gl.createBuffer();
    const vao = gl.createVertexArray();
    const attrLoc = gl.getAttribLocation(program, 'a_position');

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(MoblurRenderer.vertexPositions),
      gl.STATIC_DRAW,
    );

    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(attrLoc);
    gl.vertexAttribPointer(attrLoc, 2, gl.FLOAT, false, 0, 0);
  }

  private getSumTexture(
    gl: WebGL2RenderingContext,
    textureLocation: number,
  ): Texture {
    const texture = gl.createTexture();

    if (!texture) {
      throw new Error('Could not create WebGL2 texture for motion blur effect');
    }

    gl.activeTexture(gl.TEXTURE0 + textureLocation);
    gl.bindTexture(gl.TEXTURE_3D, texture);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return {texture, location: textureLocation};
  }

  public resize(size: Vector2) {
    const gl = this.computeContext;

    gl.viewport(0, 0, size.width, size.height);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.texImage3D(
      gl.TEXTURE_3D,
      0,
      gl.RGBA,
      size.width,
      size.height,
      this.sampleCount,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array(size.width * size.height * 4 * this.sampleCount),
    );
  }

  public setSamples(count: number) {
    this.sampleCount = count;
    this.computeContext.uniform1i(this.sampleCountUniformLoc, this.sampleCount);
  }

  public async render(
    canvasContext: CanvasRenderingContext2D,
    renderCallback: () => Promise<void>,
    playback: PlaybackManager,
  ) {
    console.time('Moblur Render');
    const canvas = canvasContext.canvas;
    const gl = this.computeContext;
    const currentFrame = playback.frame;
    const previousSpeed = playback.speed;

    playback.speed = 0.5 * (1 / this.sampleCount);
    await playback.seek(playback.frame);

    canvasContext.clearRect(
      0,
      0,
      canvasContext.canvas.width,
      canvasContext.canvas.height,
    );
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < this.sampleCount; i++) {
      await renderCallback();
      await playback.advanceTime();

      gl.texSubImage3D(
        gl.TEXTURE_3D,
        0,
        0,
        0,
        i,
        canvas.width,
        canvas.height,
        1,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        canvasContext.canvas,
      );
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    playback.speed = previousSpeed;
    await playback.seek(currentFrame);

    //copy data back to main canvas
    canvasContext.drawImage(gl.canvas, 0, 0);
    console.timeEnd('Moblur Render');
  }
}
