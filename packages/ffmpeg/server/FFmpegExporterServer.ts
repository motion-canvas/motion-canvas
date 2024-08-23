import type {RendererResult, RendererSettings} from '@motion-canvas/core';
import type {PluginConfig} from '@motion-canvas/vite-plugin';
import {ffmpegPath, ffprobePath} from 'ffmpeg-ffprobe-static';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import {Readable} from 'stream';
import {ImageStream} from './ImageStream';

ffmpeg.setFfmpegPath(ffmpegPath!);
ffmpeg.setFfprobePath(ffprobePath!);

export interface FFmpegExporterSettings extends RendererSettings {
  audio?: string;
  audioOffset?: number;
  fastStart: boolean;
  includeAudio: boolean;
}

/**
 * The server-side implementation of the FFmpeg video exporter.
 */
export class FFmpegExporterServer {
  private readonly stream: ImageStream;
  private readonly command: ffmpeg.FfmpegCommand;
  private readonly promise: Promise<void>;

  public constructor(
    settings: FFmpegExporterSettings,
    private readonly config: PluginConfig,
  ) {
    const size = {
      x: Math.round(settings.size.x * settings.resolutionScale),
      y: Math.round(settings.size.y * settings.resolutionScale),
    };
    this.stream = new ImageStream(size);
    this.command = ffmpeg();

    // Input image sequence
    this.command
      .input(this.stream)
      .inputFormat('rawvideo')
      .inputOptions(['-pix_fmt rgba', '-s:v', `${size.x}x${size.y}`])
      .inputFps(settings.fps);

    // Input audio file
    if (settings.includeAudio && settings.audio) {
      this.command
        .input((settings.audio as string).slice(1))
        // FIXME Offset only works for negative values.
        .inputOptions([`-itsoffset ${settings.audioOffset ?? 0}`]);
    }

    // Output settings
    this.command
      .output(path.join(this.config.output, `${settings.name}.mp4`))
      .outputOptions(['-pix_fmt yuv420p', '-shortest'])
      .outputFps(settings.fps)
      .size(`${size.x}x${size.y}`);
    if (settings.fastStart) {
      this.command.outputOptions(['-movflags +faststart']);
    }

    this.promise = new Promise<void>((resolve, reject) => {
      this.command.on('end', resolve).on('error', reject);
    });
  }

  public async start() {
    if (!fs.existsSync(this.config.output)) {
      await fs.promises.mkdir(this.config.output, {recursive: true});
    }
    this.command.run();
  }

  public async handleFrame(req: Readable) {
    await this.stream.pushImage(req);
  }

  public async end(result: RendererResult) {
    this.stream.pushImage(null);
    if (result === 1) {
      try {
        this.command.kill('SIGKILL');
        await this.promise;
      } catch (_) {
        // do nothing
      }
    } else {
      await this.promise;
    }
  }
}
