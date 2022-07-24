import {AudioManager} from '../media';
import type {Project} from '../Project';
import {
  AsyncEventDispatcher,
  EventDispatcher,
  ValueDispatcher,
} from '../events';

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
}

interface PlayerCommands {
  seek: number;
  recalculate: boolean;
}

export interface RenderData {
  frame: number;
  data: Blob;
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
  });

  public get onFrameChanged() {
    return this.frame.subscribable;
  }
  private readonly frame = new ValueDispatcher(0);

  public get onFrameRendered() {
    return this.frameRendered.subscribable;
  }
  private readonly frameRendered = new AsyncEventDispatcher<RenderData>();

  public get onReloaded() {
    return this.reloaded.subscribable;
  }
  private readonly reloaded = new EventDispatcher<number>();

  private startTime: number;
  private renderTime = 0;
  private requestId: number = null;

  private commands: PlayerCommands = {
    seek: -1,
    recalculate: true,
  };

  public constructor(
    public readonly project: Project,
    public readonly audio: AudioManager,
  ) {
    this.startTime = performance.now();
    this.project.framerate = this.state.current.fps;
    this.project.resolutionScale = this.state.current.scale;

    this.request();
  }

  public loadState(state: Partial<PlayerState>) {
    this.updateState(state);
    this.project.speed = state.speed;
    this.project.framerate = state.fps;
    this.project.resolutionScale = state.scale;
    this.setRange(state.startFrame, state.endFrame);
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

  public reload() {
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

  private async run() {
    const commands = this.consumeCommands();
    const state = {...this.state.current};
    if (state.finished && state.loop && commands.seek < 0) {
      commands.seek = state.startFrame;
    }

    // Recalculate
    if (commands.recalculate) {
      const startTime = performance.now();
      await this.project.recalculate();
      const duration = this.project.frame;
      const frame = commands.seek < 0 ? this.frame.current : commands.seek;
      const finished = await this.project.seek(frame);
      this.project.render();
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
      !this.audio.isInRange(this.project.time);
    if (await this.audio.setPaused(audioPaused)) {
      this.syncAudio(-3);
    }
    this.audio.setMuted(state.muted);

    // Rendering
    if (state.render) {
      state.finished = await this.project.next();
      this.project.render();
      await this.frameRendered.dispatch({
        frame: this.project.frame,
        data: await this.project.getBlob(),
      });
      if (state.finished || this.project.frame >= state.endFrame) {
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
      console.time('seek time');
      state.finished = await this.project.seek(clampedFrame);
      console.timeEnd('seek time');
      this.syncAudio(-3);
    }
    // Do nothing if paused or is ahead of the audio.
    else if (
      state.paused ||
      (state.speed === 1 &&
        this.audio.isReady() &&
        this.audio.isInRange(this.project.time) &&
        this.audio.getTime() < this.project.time)
    ) {
      this.request();
      return;
    }
    // Seek to synchronize animation with audio.
    else if (
      this.audio.isReady() &&
      state.speed === 1 &&
      this.audio.isInRange(this.project.time) &&
      this.project.time < this.audio.getTime() - MAX_AUDIO_DESYNC
    ) {
      const seekFrame = this.project.secondsToFrames(this.audio.getTime());
      state.finished = await this.project.seek(seekFrame);
    }
    // Simply move forward one frame
    else if (this.project.frame < state.endFrame) {
      state.finished = await this.project.next();

      // Synchronize audio.
      if (state.speed !== 1) {
        this.syncAudio();
      }
    }

    // Draw the project
    this.project.render();

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

  private syncAudio(frameOffset = 0) {
    this.audio.setTime(
      this.project.framesToSeconds(this.project.frame + frameOffset),
    );
  }

  private request() {
    this.requestId = requestAnimationFrame(async time => {
      if (time - this.renderTime >= 990 / this.state.current.fps) {
        this.renderTime = time;
        try {
          await this.run();
        } catch (e) {
          this.requestId = null;
          console.error(e);
        }
      } else {
        this.request();
      }
    });
  }
}
