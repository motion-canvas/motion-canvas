import type {
  RendererResult,
  RendererSettings,
  Sound,
} from '@motion-canvas/core';
import type {PluginConfig} from '@motion-canvas/vite-plugin';
import {ffmpegPath, ffprobePath} from 'ffmpeg-ffprobe-static';
import type {AudioVideoFilter, FilterSpecification} from 'fluent-ffmpeg';
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

  sounds: Sound[];
  duration: number;

  fastStart: boolean;
  includeAudio: boolean;
  audioSampleRate: number;
  splitByScene: boolean;
  highQuality: boolean;

  sceneName?: string;
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
        options = Object.entries(f.options)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => `${k}=${v}`);
      }
      return `${f.filter}=${options.join(':')}`;
    })
    .join(',');
}

/**
 * The server-side implementation of the FFmpeg video exporter.
 */
export class FFmpegSceneExporter {
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

    const splitByScene = settings.sceneName !== undefined;
    // Input audio
    const sounds = [
      ...settings.sounds
        .filter(
          sound => !splitByScene || sound.sceneName === settings.sceneName,
        )
        .map(sound => {
          if (splitByScene && sound.sceneFirstFrame !== undefined) {
            sound.offset -= sound.sceneFirstFrame / settings.fps;
          }
          return sound;
        }),
    ];
    if (settings.audio && settings.includeAudio) {
      sounds.push({
        audio: settings.audio,
        realPlaybackRate: 1,
        offset: settings.audioOffset ?? 0,
      });
    }

    const filterSpec: FilterSpecification[] = [];
    const streams: string[] = [];

    for (let i = 0; i < sounds.length; i++) {
      const sound = sounds[i];
      this.command.input(sound.audio.slice(1));

      let trimmed = sound.start ?? 0;
      if (sound.offset < 0) {
        trimmed -= sound.offset * sound.realPlaybackRate;
      }

      if (trimmed !== 0) {
        this.command.inputOptions(`-ss ${trimmed}`);
      }

      const filters: AudioVideoFilter[] = [];
      if (sound.end !== undefined) {
        filters.push({
          filter: 'atrim',
          options: {end: sound.end - trimmed},
        });
      }

      filters.push({
        filter: 'aresample',
        options: settings.audioSampleRate.toString(),
      });

      if (sound.gain) {
        filters.push({
          filter: 'volume',
          options: {volume: `${sound.gain}dB`},
        });
      }

      if (sound.realPlaybackRate !== 1) {
        const rate = Math.round(
          settings.audioSampleRate * sound.realPlaybackRate,
        );
        filters.push({
          filter: 'asetrate',
          options: {r: rate},
        });
        filters.push({
          filter: 'aresample',
          options: settings.audioSampleRate.toString(),
        });
      }

      if (sound.offset > 0) {
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

    const extension = settings.highQuality ? 'mkv' : 'mp4';
    // Output settings
    this.command
      .output(path.join(this.config.output, `${settings.name}.${extension}`))
      .outputOptions([
        '-pix_fmt yuv420p',
        `-t ${settings.duration / settings.fps}`,
        `-c:v libx264`,
      ])
      .outputFps(settings.fps)
      .size(`${size.x}x${size.y}`);
    if (settings.fastStart && !settings.highQuality) {
      this.command.outputOptions(['-movflags +faststart']);
    }
    if (settings.highQuality) {
      this.command.outputOptions(['-c:a flac', '-preset slower', '-crf 12']);
    }

    this.promise = new Promise<void>((resolve, reject) => {
      this.command.on('end', resolve).on('error', reject);
    });
  }

  public async start() {
    if (!fs.existsSync(this.config.output)) {
      await fs.promises.mkdir(this.config.output, {recursive: true});
    }
    this.command.on('stderr', console.error);
    this.command.run();
  }

  public async handleFrame(data: Readable) {
    await this.stream.pushImage(data);
  }

  public async end(result?: RendererResult) {
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

/**
 * The server-side implementation of the FFmpeg video exporter.
 */
export class FFmpegExporterServer {
  private sceneExporter?: FFmpegSceneExporter;
  private currentSceneName?: string;

  public constructor(
    private readonly settings: FFmpegExporterSettings,
    private readonly config: PluginConfig,
  ) {}

  public async start() {}

  public async reportScene(data: any) {
    const sceneName: string = this.settings.splitByScene
      ? data.sceneName
      : 'project';
    if (this.currentSceneName === sceneName) return;
    this.currentSceneName = sceneName;
    if (this.sceneExporter !== undefined) await this.sceneExporter.end();
    this.sceneExporter = new FFmpegSceneExporter(
      {
        ...this.settings,
        sceneName: this.settings.splitByScene ? sceneName : undefined,
        name: sceneName,
      },
      this.config,
    );
    this.sceneExporter.start();
  }

  public async handleFrame(data: Readable) {
    return await this.sceneExporter!.handleFrame(data);
  }

  public async end(result: RendererResult) {
    return await this.sceneExporter!.end(result);
  }
}
