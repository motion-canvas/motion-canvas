import {Vector2} from '../types';
import * as WebGL from '../utils/webGLHelpers';

import vertexShaderSrc from '../../shaders/basicVertex.glsl?raw';
import divShaderSrc from '../../shaders/moblur_div.glsl?raw';
import sumShaderSrc from '../../shaders/moblur_sum.glsl?raw';

type Texture = {texture: WebGLTexture; readonly location: number};
type FrameBuffer = {
  frameBuffer: WebGLFramebuffer;
  texture: WebGLTexture;
  readonly location: number;
};

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

  private readonly drawContext: OffscreenCanvasRenderingContext2D;
  private readonly computeContext: WebGL2RenderingContext;
  private readonly sumProgram: WebGLProgram;
  private readonly divProgram: WebGLProgram;
  private readonly frameBuffer1: FrameBuffer;
  private readonly frameBuffer2: FrameBuffer;
  private readonly addendTexture: Texture;
  private readonly sumAccUniformLoc: WebGLUniformLocation;
  private readonly sumAddendUniformLoc: WebGLUniformLocation;
  private readonly sumCanvasHeightUniformLoc: WebGLUniformLocation;
  private readonly divSrcUniformLoc: WebGLUniformLocation;
  private readonly divSampleCountUniformLoc: WebGLUniformLocation;
  private sampleCount: number = 1;

  public constructor(size: Vector2, samples: number) {
    const drawBuffer = new OffscreenCanvas(size.x, size.y);
    const computeBuffer = new OffscreenCanvas(size.x, size.y);
    const drawContext = drawBuffer?.getContext('2d');
    const computeContext = computeBuffer?.getContext('webgl2');

    if (!(drawContext && computeContext)) {
      throw new Error(
        'Error creating MoblurRenderer. Use "MoblurRenderer.checkSupport()" before calling constructor',
      );
    }

    this.drawContext = drawContext;
    this.computeContext = computeContext;
    this.sampleCount = samples;

    const gl = this.computeContext;
    const vertexShader = WebGL.compileShader(
      gl,
      gl.VERTEX_SHADER,
      vertexShaderSrc,
    )!;
    const sumFS = WebGL.compileShader(gl, gl.FRAGMENT_SHADER, sumShaderSrc)!;
    const divFS = WebGL.compileShader(gl, gl.FRAGMENT_SHADER, divShaderSrc)!;
    this.sumProgram = WebGL.compileProgram(gl, vertexShader, sumFS)!;
    this.divProgram = WebGL.compileProgram(gl, vertexShader, divFS)!;
    this.sumAccUniformLoc = gl.getUniformLocation(this.sumProgram, 'accTex')!;
    this.sumAddendUniformLoc = gl.getUniformLocation(
      this.sumProgram,
      'addendTex',
    )!;
    this.sumCanvasHeightUniformLoc = gl.getUniformLocation(
      this.sumProgram,
      'canvasHeight',
    )!;
    this.divSrcUniformLoc = gl.getUniformLocation(this.divProgram, 'srcTex')!;
    this.divSampleCountUniformLoc = gl.getUniformLocation(
      this.divProgram,
      'samples',
    )!;
    this.frameBuffer1 = this.getFrameBuffer(gl, size, 0);
    this.frameBuffer2 = this.getFrameBuffer(gl, size, 1);
    this.addendTexture = this.getAddendTexture(gl, 2);
    this.setupAllVertexBuffers(gl);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.sumProgram);
    gl.uniform1i(this.sumAddendUniformLoc, this.addendTexture.location);
    gl.uniform1i(this.sumCanvasHeightUniformLoc, size.y);

    gl.useProgram(this.divProgram);
    gl.uniform1i(this.divSampleCountUniformLoc, this.sampleCount);
    console.log('Initial samples', this.sampleCount);
  }

  private setVertexPositions(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    attrName: string,
  ) {
    const attrLoc = gl.getAttribLocation(program, attrName);

    gl.enableVertexAttribArray(attrLoc);
    gl.vertexAttribPointer(attrLoc, 2, gl.FLOAT, false, 0, 0);
  }

  private setupAllVertexBuffers(gl: WebGL2RenderingContext) {
    const positionBuffer = gl.createBuffer();
    const vao = gl.createVertexArray();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(MoblurRenderer.vertexPositions),
      gl.STATIC_DRAW,
    );

    gl.bindVertexArray(vao);
    this.setVertexPositions(gl, this.sumProgram, 'a_position');
    this.setVertexPositions(gl, this.divProgram, 'a_position');
  }

  private getFrameBuffer(
    gl: WebGL2RenderingContext,
    size: Vector2,
    textureLocation: number,
  ): FrameBuffer {
    const frameBuffer = gl.createFramebuffer();
    const texture = gl.createTexture();
    const emptyData = new Int32Array(size.width * size.height * 4);

    if (!(frameBuffer && texture)) {
      throw new Error(
        'Could not create WebGL2 framebuffer for motion blur effect',
      );
    }

    gl.activeTexture(gl.TEXTURE0 + textureLocation);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA32I,
      size.width,
      size.height,
      0,
      gl.RGBA_INTEGER,
      gl.INT,
      emptyData,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );

    return {frameBuffer, texture, location: textureLocation};
  }

  private clear(gl: WebGL2RenderingContext) {
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  private getAddendTexture(
    gl: WebGL2RenderingContext,
    textureLocation: number,
  ): Texture {
    const texture = gl.createTexture();

    if (!texture) {
      throw new Error('Could not create WebGL2 texture for motion blur effect');
    }

    gl.activeTexture(gl.TEXTURE0 + textureLocation);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return {texture, location: textureLocation};
  }

  private bindTexture(gl: WebGL2RenderingContext, texture: Texture) {
    gl.activeTexture(gl.TEXTURE0 + texture.location);
    gl.bindTexture(gl.TEXTURE_2D, texture.texture);
  }

  public resize(size: Vector2) {
    const gl = this.computeContext;
    const emptyData = new Float32Array(size.width * size.height * 4);

    gl.viewport(0, 0, size.width, size.height);

    this.bindTexture(gl, this.frameBuffer1);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA32I,
      size.width,
      size.height,
      0,
      gl.RGBA_INTEGER,
      gl.INT,
      emptyData,
    );

    this.bindTexture(gl, this.frameBuffer2);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA32I,
      size.width,
      size.height,
      0,
      gl.RGBA_INTEGER,
      gl.INT,
      emptyData,
    );

    this.computeContext.useProgram(this.sumProgram);
    this.computeContext.uniform1i(this.sumCanvasHeightUniformLoc, size.y);
  }

  public setSamples(count: number) {
    this.sampleCount = count;
    this.computeContext.useProgram(this.divProgram);
    this.computeContext.uniform1i(
      this.divSampleCountUniformLoc,
      this.sampleCount,
    );
  }

  public render(
    context: CanvasRenderingContext2D,
    renderCallback: (bufferContext: CanvasRenderingContext2D) => void,
  ) {
    console.time('Moblur Render');
    const drawCanvas = this.drawContext.canvas;
    const gl = this.computeContext;

    this.clear(gl);

    this.bindTexture(gl, this.addendTexture);
    gl.useProgram(this.sumProgram);

    for (let i = 0; i < this.sampleCount; i++) {
      renderCallback(this.drawContext as unknown as CanvasRenderingContext2D);
      /* ## need to add time logic here ## */

      if (!(i % 2)) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer1.frameBuffer);
        gl.uniform1i(this.sumAccUniformLoc, this.frameBuffer2.location);
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer2.frameBuffer);
        gl.uniform1i(this.sumAccUniformLoc, this.frameBuffer1.location);
      }

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        drawCanvas.width,
        drawCanvas.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        drawCanvas,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.useProgram(this.divProgram);
    gl.uniform1i(
      this.divSrcUniformLoc,
      !(this.sampleCount % 2)
        ? this.frameBuffer1.location
        : this.frameBuffer2.location,
    );
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    //copy data back to main canvas
    context.drawImage(gl.canvas, 0, 0);
    console.timeEnd('Moblur Render');
  }
}
