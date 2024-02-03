import {Logger} from './Logger';
import includeWithoutPreprocessor from './__logs__/include-without-preprocessor.md';

const SOURCE_URL_REGEX = /^\/\/# sourceURL=(.*)$/gm;
const INFO_LOG_REGEX = /ERROR: \d+:(\d+): (.*)/g;
const INFO_TOKEN_REGEX = /^'([^']+)'/;

/**
 * @internal
 */
export interface WebGLContextOwner {
  setup(gl: WebGL2RenderingContext): void;
  teardown(gl: WebGL2RenderingContext): void;
}

interface WebGLProgramData {
  program: WebGLProgram;
  fragment: WebGLShader;
  vertex: WebGLShader;
}

export class SharedWebGLContext {
  private gl: WebGL2RenderingContext | null = null;
  private currentOwner: WebGLContextOwner | null = null;
  private readonly programLookup = new Map<string, WebGLProgramData>();

  public constructor(private readonly logger: Logger) {}

  public borrow(owner: WebGLContextOwner): WebGL2RenderingContext {
    if (this.currentOwner === owner) {
      return this.gl!;
    }

    this.currentOwner?.teardown(this.gl!);
    this.currentOwner = owner;
    this.currentOwner.setup(this.getGL());
    return this.gl!;
  }

  /**
   * Dispose the WebGL context to free up resources.
   */
  public dispose() {
    if (!this.gl) {
      return;
    }

    this.currentOwner?.teardown(this.gl);
    this.currentOwner = null;

    this.gl.useProgram(null);
    for (const {program, fragment, vertex} of this.programLookup.values()) {
      this.gl.deleteProgram(program);
      this.gl.deleteShader(fragment);
      this.gl.deleteShader(vertex);
    }

    this.programLookup.clear();
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
    (this.gl.canvas as HTMLCanvasElement).remove();
    this.gl = null;
  }

  public getProgram(fragment: string, vertex: string): WebGLProgram | null {
    const key = `${fragment}#${vertex}`;
    if (this.programLookup.has(key)) {
      return this.programLookup.get(key)!.program;
    }

    const gl = this.getGL();
    const fragmentShader = this.getShader(gl.FRAGMENT_SHADER, fragment);
    const vertexShader = this.getShader(gl.VERTEX_SHADER, vertex);
    if (!fragmentShader || !vertexShader) {
      return null;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, fragmentShader);
    gl.attachShader(program, vertexShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      this.logger.error({
        message: 'Failed to initialize the shader program.',
        remarks: gl.getProgramInfoLog(program) ?? undefined,
        stack: new Error().stack,
      });
      gl.deleteProgram(program);
      return null;
    }

    this.programLookup.set(key, {
      program,
      fragment: fragmentShader,
      vertex: vertexShader,
    });

    return program;
  }

  private getShader(type: GLenum, source: string): WebGLShader | null {
    const gl = this.getGL();
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      logGlslError(this.logger, log, source);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private getGL(): WebGL2RenderingContext {
    if (this.gl) {
      return this.gl;
    }

    this.gl = document.createElement('canvas').getContext('webgl2', {
      depth: false,
      premultipliedAlpha: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    if (!this.gl) {
      throw new Error('Failed to initialize WebGL.');
    }

    /* NOTE: Temporary debugging code
    const canvas = this.gl.canvas as HTMLCanvasElement;
    document.body.append(canvas);
    canvas.style.position = 'absolute';
    canvas.style.top = '16px';
    canvas.style.right = '16px';
    canvas.style.width = '300px';
    canvas.style.borderRadius = '4px';
    canvas.style.border = '1px solid #ccc';
    canvas.style.backgroundColor = '#141414';
    canvas.style.zIndex = '1000';
    */

    return this.gl;
  }
}

function logGlslError(logger: Logger, log: string | null, source: string) {
  let sourceUrl: string | null = null;

  SOURCE_URL_REGEX.lastIndex = 0;
  const sourceMatch = SOURCE_URL_REGEX.exec(source);
  if (sourceMatch) {
    const url = new URL(sourceMatch[1], window.location.origin);
    url.searchParams.set('t', Date.now().toString());
    sourceUrl = url.toString();
  }

  if (!log) {
    logger.error({
      message: `Unknown shader compilation error.`,
      stack: fakeStackTrace(sourceUrl, 1, 0),
    });
    return null;
  }

  let logged = false;
  let result;
  while ((result = INFO_LOG_REGEX.exec(log))) {
    const [, line, message] = result;
    let column = 0;
    const match = message.match(INFO_TOKEN_REGEX);
    if (match) {
      const tokenLine = source.split('\n')[parseInt(line)! - 1];
      const index = tokenLine.indexOf(match[1]!);
      if (index !== -1) {
        column = index;
      }

      if (match[1] === 'include') {
        const line = source
          .split('\n')
          .find(line => line.startsWith('#include'));
        if (line) {
          logged = true;
          logger.error({
            message: `Shader compilation error: ${message}`,
            remarks: includeWithoutPreprocessor,
          });
          break;
        }
      }
    }

    logged = true;
    logger.error({
      message: `Shader compilation error: ${message}`,
      stack: fakeStackTrace(sourceUrl, line, column),
    });
  }

  if (!logged) {
    logger.error({
      message: `Shader compilation error: ${log}`,
      stack: fakeStackTrace(sourceUrl, 1, 0),
    });
  }
}

function fakeStackTrace(
  file: string | null,
  line: string | number,
  column: string | number,
): string | undefined {
  if (!file) {
    return undefined;
  }

  return navigator.userAgent.toLowerCase().includes('chrome')
    ? `  at (${file}:${line}:${column})`
    : `@${file}:${line}:${column}`;
}
