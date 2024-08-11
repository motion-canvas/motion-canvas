import type {
  RendererResult,
  RendererSettings,
  Sound,
} from '@motion-canvas/core';
import type {PluginConfig} from '@motion-canvas/vite-plugin';
import {exec} from 'child_process';
import {ffmpegPath, ffprobePath} from 'ffmpeg-ffprobe-static';
import type {AudioVideoFilter, FilterSpecification} from 'fluent-ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import {promisify} from 'util';
import {Readable} from 'stream';
import {ImageStream} from './ImageStream';

ffmpeg.setFfmpegPath(ffmpegPath!);
ffmpeg.setFfprobePath(ffprobePath!);

export interface FFmpegExporterSettings extends RendererSettings {
  audio?: string;
  audioOffset?: number;
  sounds: Sound[];
  fastStart: boolean;
  includeAudio: boolean;
}

function formatFilters(filters: AudioVideoFilter[]): string {
  return filters
    .map(f => {
      let options: string[] = [];
      if (typeof f.options === 'string') {
        options = [f.options];
      } else if (f.options.constructor === Array) {
        options = f.options;
      } else {
        options = Object.entries(f.options).map(([k, v]) => `${k}=${v}`);
      }
      return `${f.filter}=${options.join(':')}`;
    })
    .join(',');
}

/**
 * The server-side implementation of the FFmpeg video exporter.
 */
export class FFmpegExporterServer {
  private readonly stream: ImageStream;
  private readonly construction: Promise<void>;
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
    this.promise = new Promise<void>((resolve, reject) => {
      this.command.on('end', resolve).on('error', reject);
    });

    this.construction = this.constructCommand(settings, size);
  }

  private async constructCommand(
    settings: FFmpegExporterSettings,
    size: {x: number, y: number},
  ): Promise<void> {
    // Input image sequence
    this.command
      .input(this.stream)
      .inputFormat('rawvideo')
      .inputOptions(['-pix_fmt rgba', '-s:v', `${size.x}x${size.y}`])
      .inputFps(settings.fps);

    // Input audio
    const sounds = [...settings.sounds];
    if (settings.audio && settings.includeAudio) {
      sounds.push({
        audio: settings.audio,
        offset: settings.audioOffset ?? 0,
      });
    }

    const filterSpec: FilterSpecification[] = [];
    const streams: string[] = [];

    const sampleRates: Map<string, number> = new Map();
    const getRate = async (file: string) => {
      const rate = sampleRates.get(file);
      if (rate !== undefined) {
        return rate;
      } else {
        const cmd = `${ffprobePath} -v error -show_entries stream=sample_rate -of default=nw=1:nk=1 ${file.slice(
          1,
        )}`;
        const rate = parseInt((await promisify(exec)(cmd)).stdout);
        sampleRates.set(file, rate);
        return rate;
      }
    };

    for (let i = 0; i < sounds.length; i++) {
      const sound = sounds[i];
      this.command.input(sound.audio.slice(1));

      const filters: AudioVideoFilter[] = [];

      if (sound.start || sound.end !== undefined) {
        filters.push({
          filter: 'atrim',
          options: {start: sound.start, end: sound.end},
        });
      }

      if (sound.gain) {
        filters.push({
          filter: 'volume',
          options: {volume: `${sound.gain}dB`},
        });
      }

      const playback =
        Math.pow(2, (sound.detune ?? 0) / 1200) * (sound.playbackRate ?? 1);
      if (playback !== 1) {
        const rate = Math.round((await getRate(sound.audio)) * playback);
        filters.push({
          filter: 'asetrate',
          options: {r: rate},
        });
      }

      if (sound.offset < 0) {
        filters.push({
          filter: 'atrim',
          options: {start: -sound.offset},
        });
      } else if (sound.offset > 0) {
        const delay = Math.round(sound.offset * 1000);
        filters.push({
          filter: 'adelay',
          options: {delays: delay, all: 1},
        });
      }

      if (filters.length > 0) {
        filterSpec.push({
          inputs: `${i + 1}:a`,
          filter: formatFilters(filters),
          outputs: `a${i + 1}`,
        });
        streams.push(`a${i + 1}`);
      } else {
        streams.push(`${i + 1}:a`);
      }
    }

    if (sounds.length > 0) {
      this.command.complexFilter([
        ...filterSpec,
        {
          filter: 'amix',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          options: {inputs: sounds.length, dropout_transition: 0, normalize: 0},
          inputs: streams,
          outputs: 'a',
        },
      ]);
      this.command.outputOptions(['-map 0:v', '-map [a]']);
    }

    // Output settings
    this.command
      .output(path.join(this.config.output, `${settings.name}.mp4`))
      .outputOptions(['-pix_fmt yuv420p'])
      .outputFps(settings.fps)
      .size(`${size.x}x${size.y}`);
    if (settings.fastStart) {
      this.command.outputOptions(['-movflags +faststart']);
    }
  }

  public async start() {
    if (!fs.existsSync(this.config.output)) {
      await fs.promises.mkdir(this.config.output, {recursive: true});
    }
    await this.construction;
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
