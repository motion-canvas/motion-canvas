import type {Project} from '../Project';
import {PlaybackState} from '../Project';
import {EventDispatcher, ValueDispatcher} from '../events';
import type {CanvasColorSpace, CanvasOutputMimeType} from '../types';
import {Logger} from '../Logger';

const MAX_AUDIO_DESYNC = 1 / 50;

export interface PlayerState extends Record<string, unknown> {
  duration: number;
  startFrame: number;
  endFrame: number;
  paused: boolean;
  loading: boolean;
  finished: boolean;
  loop: boolean;
  speed: number;
  render: boolean;
  muted: boolean;
  fps: number;
  scale: number;
  colorSpace: CanvasColorSpace;
  fileType: CanvasOutputMimeType;
  quality: number;
}

interface PlayerCommands {
  seek: number;
  recalculate: boolean;
}

export class Player {
  public get onStateChanged() {
    return this.state.subscribable;
  }
  private readonly state = new ValueDispatcher<PlayerState>({
    duration: Infinity,
    startFrame: 0,
    endFrame: Infinity,
    paused: true,
    loading: false,
    finished: false,
    loop: true,
    speed: 1,
    render: false,
    muted: true,
    fps: 30,
    scale: 1,
    colorSpace: 'srgb',
    fileType: 'image/png',
    quality: 1,
  });

  public get onFrameChanged() {
    return this.frame.subscribable;
  }
  private readonly frame = new ValueDispatcher(0);

  public get onReloaded() {
    return this.reloaded.subscribable;
  }
  private readonly reloaded = new EventDispatcher<number>();

  private startTime: number;
  private renderTime = 0;
  private requestId: number | null = null;

  private commands: PlayerCommands = {
    seek: -1,
    recalculate: true,
  };

  private readonly logger: Logger;

  public constructor(public readonly project: Project) {
    this.startTime = performance.now();
    this.logger = this.project.logger;
    this.project.framerate = this.state.current.fps;
    this.project.resolutionScale = this.state.current.scale;
    this.project.colorSpace = this.state.current.colorSpace;
    // TODO Recalculation should be handled by the project.
    this.project.onReloaded.subscribe(() => this.reload());

    this.request();
  }

  public loadState(state: Partial<PlayerState>) {
    this.updateState(state);
    this.project.speed = this.state.current.speed;
    this.project.framerate = this.state.current.fps;
    this.project.resolutionScale = this.state.current.scale;
    this.project.colorSpace = this.state.current.colorSpace;
    this.setRange(this.state.current.startFrame, this.state.current.endFrame);
  }

  private updateState(newState: Partial<PlayerState>) {
    let changed = false;
    for (const prop in newState) {
      if (newState[prop] !== this.state.current[prop]) {
        changed = true;
        break;
      }
    }

    if (changed) {
      this.state.current = {
        ...this.state.current,
        ...newState,
      };
    }
  }

  private consumeCommands(): PlayerCommands {
    const commands = {...this.commands};
    this.commands.seek = -1;
    this.commands.recalculate = false;

    return commands;
  }

  private reload() {
    this.commands.recalculate = true;
    if (this.requestId === null) {
      this.request();
    }
  }

  public setRange(
    startFrame = this.state.current.startFrame,
    endFrame = this.state.current.endFrame,
  ) {
    if (endFrame >= this.state.current.duration || !endFrame) {
      endFrame = Infinity;
    }

    if (startFrame < 0) {
      startFrame = 0;
    }

    if (startFrame > endFrame) {
      [startFrame, endFrame] = [endFrame, startFrame];
    }

    if (endFrame - startFrame < 1) {
      if (startFrame !== 0) {
        startFrame--;
      } else {
        endFrame++;
      }
    }

    this.updateState({startFrame, endFrame});
  }

  public setSpeed(value: number) {
    this.project.speed = value;
    this.updateState({speed: value});
    this.reload();
  }

  public setFramerate(fps: number) {
    const ratio = fps / this.state.current.fps;
    this.project.framerate = fps;
    this.updateState({
      fps,
      startFrame: Math.floor(this.state.current.startFrame * ratio),
      endFrame: Math.floor(this.state.current.endFrame * ratio),
      duration: Math.floor(this.state.current.duration * ratio),
    });
    this.requestSeek(Math.floor(this.frame.current * ratio));
    this.reload();
  }

  public setScale(scale: number) {
    this.project.resolutionScale = scale;
    this.updateState({scale});
    this.project.render();
  }

  public setColorSpace(colorSpace: CanvasColorSpace) {
    this.project.colorSpace = colorSpace;
    this.updateState({colorSpace});
    this.project.render();
  }

  public setFileType(fileType: CanvasOutputMimeType) {
    this.project.fileType = fileType;
    this.updateState({fileType});
  }

  public setQuality(quality: number) {
    this.project.quality = quality;
    this.updateState({quality});
  }

  public requestPreviousFrame(): void {
    this.commands.seek = this.frame.current - this.state.current.speed;
  }

  public requestNextFrame(): void {
    this.commands.seek = this.frame.current + this.state.current.speed;
  }

  public requestReset(): void {
    this.commands.seek = 0;
  }

  public requestSeek(value: number): void {
    this.commands.seek = this.clampRange(value, this.state.current);
  }

  public toggleLoop(value = !this.state.current.loop) {
    this.updateState({loop: value});
  }

  public togglePlayback(value: boolean = this.state.current.paused): void {
    this.updateState({paused: !value});
  }

  public toggleRendering(value = !this.state.current.render): void {
    if (value) {
      this.requestSeek(0);
      this.reload();
    }
    this.updateState({render: value});
  }

  public toggleAudio(value: boolean = this.state.current.muted): void {
    this.updateState({muted: !value});
  }

  public async exportCurrentFrame() {
    await this.project.export(true);
  }

  private async run() {
    const commands = this.consumeCommands();
    const state = {...this.state.current};
    if (state.finished && state.loop && commands.seek < 0) {
      commands.seek = state.startFrame;
    }

    const previousState = this.project.playbackState();
    this.project.playbackState(
      state.paused ? PlaybackState.Paused : PlaybackState.Playing,
    );

    // Recalculate
    if (commands.recalculate) {
      const startTime = performance.now();
      await this.project.recalculate();
      const duration = this.project.frame;
      const frame = commands.seek < 0 ? this.frame.current : commands.seek;
      const finished = await this.project.seek(frame);
      await this.project.render();
      this.updateState({
        duration,
        finished,
        endFrame:
          state.endFrame !== Infinity && state.endFrame > duration
            ? duration
            : state.endFrame,
      });
      if (this.frame.current + 1 !== this.project.frame) {
        this.frame.current = this.project.frame;
      }
      this.request();
      this.reloaded.dispatch(performance.now() - startTime);
      return;
    }

    // Pause / play audio.
    const audioPaused =
      state.paused ||
      state.finished ||
      state.render ||
      !this.project.audio.isInRange(this.project.time);
    if (await this.project.audio.setPaused(audioPaused)) {
      this.project.syncAudio(-3);
    }
    this.project.audio.setMuted(state.muted);

    // Rendering
    if (state.render) {
      this.project.playbackState(PlaybackState.Rendering);
      state.finished = await this.project.next();
      await this.project.render();
      try {
        await this.project.export();
      } catch (e: any) {
        this.logger.error(e);
        this.toggleRendering(false);
      }

      if (state.finished || this.project.frame >= state.endFrame) {
        await this.project.finishExport();
        this.toggleRendering(false);
      }

      this.updateState({
        finished: state.finished,
      });
      this.frame.current = this.project.frame;
      this.request();
      return;
    }

    // Seek to the given frame
    if (commands.seek >= 0 || !this.isInRange(this.project.frame, state)) {
      const seekFrame = commands.seek < 0 ? this.project.frame : commands.seek;
      const clampedFrame = this.clampRange(seekFrame, state);
      this.logger.profile('seek time');
      state.finished = await this.project.seek(clampedFrame);
      this.logger.profile('seek time');
      this.project.syncAudio(-3);
    }
    // Do nothing if paused or is ahead of the audio.
    else if (
      state.paused ||
      (state.speed === 1 &&
        this.project.audio.isReady() &&
        this.project.audio.isInRange(this.project.time) &&
        this.project.audio.getTime() < this.project.time)
    ) {
      if (state.paused && previousState !== PlaybackState.Paused) {
        await this.project.render();
      }

      // Sync the audio if the animation is too far ahead.
      if (this.project.time > this.project.audio.getTime() + MAX_AUDIO_DESYNC) {
        this.project.syncAudio();
      }

      this.request();
      return;
    }
    // Seek to synchronize animation with audio.
    else if (
      this.project.audio.isReady() &&
      state.speed === 1 &&
      this.project.audio.isInRange(this.project.time) &&
      this.project.time < this.project.audio.getTime() - MAX_AUDIO_DESYNC
    ) {
      const seekFrame = this.project.secondsToFrames(
        this.project.audio.getTime(),
      );
      state.finished = await this.project.seek(seekFrame);
    }
    // Simply move forward one frame
    else if (this.project.frame < state.endFrame) {
      state.finished = await this.project.next();

      // Synchronize audio.
      if (state.speed !== 1) {
        this.project.syncAudio();
      }
    }

    // Draw the project
    await this.project.render();

    // handle finishing
    if (state.finished) {
      if (commands.seek >= 0) {
        this.requestSeek(state.startFrame);
      }
    }

    this.updateState({
      finished: state.finished || this.project.frame >= state.endFrame,
    });
    this.frame.current = this.project.frame;

    this.request();
  }

  private clampRange(frame: number, state: PlayerState): number {
    return frame > state.endFrame
      ? state.endFrame
      : frame < state.startFrame
      ? state.startFrame
      : frame;
  }

  private isInRange(frame: number, state: PlayerState): boolean {
    return frame >= state.startFrame && frame <= state.endFrame;
  }

  private request() {
    this.requestId = requestAnimationFrame(async time => {
      if (time - this.renderTime >= 990 / this.state.current.fps) {
        this.renderTime = time;
        try {
          await this.run();
        } catch (e: any) {
          this.requestId = null;
          this.logger.error(e);
        }
      } else {
        this.request();
      }
    });
  }
}
