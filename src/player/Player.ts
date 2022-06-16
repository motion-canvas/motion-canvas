import {
  PromiseSimpleEventDispatcher,
  SimpleEventDispatcher,
} from 'strongly-typed-events';

import {AudioManager} from '../audio';
import type {Project} from '../Project';

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

export interface PlayerTime {
  duration: number;
  durationTime: number;
  frame: number;
  completion: number;
  time: number;
}

interface PlayerCommands {
  reset: boolean;
  seek: number;
  recalculate: boolean;
}

export interface PlayerRenderEvent {
  frame: number;
  data: Blob;
}

export class Player {
  public get StateChanged() {
    return this.stateChanged.asEvent();
  }

  public get TimeChanged() {
    return this.timeChanged.asEvent();
  }

  public get FrameRendered() {
    return this.frameRendered.asEvent();
  }

  public get Reloaded() {
    return this.reloaded.asEvent();
  }

  private readonly stateChanged = new SimpleEventDispatcher<PlayerState>();
  private readonly timeChanged = new SimpleEventDispatcher<PlayerTime>();
  private readonly frameRendered =
    new PromiseSimpleEventDispatcher<PlayerRenderEvent>();
  private readonly reloaded = new SimpleEventDispatcher<number>();

  private startTime: number;
  private renderTime = 0;
  private requestId: number = null;
  private frame = 0;

  private commands: PlayerCommands = {
    reset: true,
    seek: -1,
    recalculate: true,
  };

  private state: PlayerState = {
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
  };

  public constructor(
    public readonly project: Project,
    public readonly audio: AudioManager,
  ) {
    this.startTime = performance.now();
    this.project.framerate = this.state.fps;
    this.project.resolutionScale = this.state.scale;

    this.request();
  }

  public getState(): PlayerState {
    return {...this.state};
  }

  public getTime(): PlayerTime {
    return {
      frame: this.frame,
      time: this.project.framesToSeconds(this.frame),
      duration: this.state.duration,
      durationTime: this.project.framesToSeconds(this.state.duration),
      completion: this.frame / this.state.duration,
    };
  }

  public loadState(state: Partial<PlayerState>) {
    this.updateState(state);
    this.project.framerate = state.fps;
    this.project.resolutionScale = state.scale;
    this.setRange(state.startFrame, state.endFrame);
  }

  private updateState(newState: Partial<PlayerState>) {
    let changed = false;
    for (const prop in newState) {
      if (newState[prop] !== this.state[prop]) {
        changed = true;
        break;
      }
    }

    if (changed) {
      this.state = {
        ...this.state,
        ...newState,
      };
      this.stateChanged.dispatch(this.state);
    }
  }

  private updateFrame(value: number) {
    this.frame = value;
    this.timeChanged.dispatch(this.getTime());
  }

  private consumeCommands(): PlayerCommands {
    const commands = {...this.commands};
    this.commands.reset = false;
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
    startFrame = this.state.startFrame,
    endFrame = this.state.endFrame,
  ) {
    if (endFrame >= this.state.duration || !endFrame) {
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
    this.updateState({speed: value});
  }

  public setFramerate(fps: number) {
    const ratio = fps / this.state.fps;
    this.project.framerate = fps;
    this.updateState({
      fps,
      startFrame: Math.floor(this.state.startFrame * ratio),
      endFrame: Math.floor(this.state.endFrame * ratio),
      duration: Math.floor(this.state.duration * ratio),
    });
    this.requestSeek(Math.floor(this.frame * ratio));
    this.reload();
  }

  public setScale(scale: number) {
    this.project.resolutionScale = scale;
    this.updateState({scale});
    this.project.draw();
  }

  public requestPreviousFrame(): void {
    this.commands.seek = this.frame - 1;
  }

  public requestNextFrame(): void {
    this.commands.seek = this.frame + 1;
  }

  public requestReset(): void {
    this.commands.seek = 0;
  }

  public requestSeek(value: number): void {
    this.commands.seek = this.clampRange(value, this.state);
  }

  public toggleLoop(value = !this.state.loop) {
    this.updateState({loop: value});
  }

  public togglePlayback(value: boolean = this.state.paused): void {
    this.updateState({paused: !value});
  }

  public toggleRendering(value = !this.state.render): void {
    if (value) {
      this.requestSeek(0);
      this.reload();
    }
    this.updateState({render: value});
  }

  public toggleAudio(value: boolean = this.state.muted): void {
    this.updateState({muted: !value});
  }

  private async run() {
    const commands = this.consumeCommands();
    const state = {...this.state};
    if (state.finished && state.loop && commands.seek < 0) {
      commands.seek = state.startFrame;
    }

    // Recalculate
    if (commands.recalculate) {
      const startTime = performance.now();
      await this.project.recalculate();
      const duration = this.project.frame;
      const frame = commands.seek < 0 ? this.frame : commands.seek;
      const finished = await this.project.seek(frame);
      this.project.draw();
      this.updateState({
        duration,
        finished,
        endFrame:
          state.endFrame !== Infinity && state.endFrame > duration
            ? duration
            : state.endFrame,
      });
      if (this.frame + 1 !== this.project.frame) {
        this.updateFrame(this.project.frame);
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
      this.project.draw();
      await this.frameRendered.dispatchAsync({
        frame: this.project.frame,
        data: await this.project.getBlob(),
      });
      if (state.finished || this.project.frame >= state.endFrame) {
        this.toggleRendering(false);
      }

      this.updateState({
        finished: state.finished,
      });
      this.updateFrame(this.project.frame);
      this.request();
      return;
    }

    // Seek to the given frame
    if (commands.seek >= 0 || !this.isInRange(this.project.frame, state)) {
      const seekFrame = commands.seek < 0 ? this.project.frame : commands.seek;
      const clampedFrame = this.clampRange(seekFrame, state);
      console.time('seek time');
      state.finished = await this.project.seek(clampedFrame, state.speed);
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
      state.finished = await this.project.seek(seekFrame, state.speed);
    }
    // Simply move forward one frame
    else if (this.project.frame < state.endFrame) {
      state.finished = await this.project.next(state.speed);

      // Synchronize audio.
      if (state.speed !== 1) {
        this.syncAudio();
      }
    }

    // Draw the project
    this.project.draw();

    // handle finishing
    if (state.finished) {
      if (commands.seek >= 0) {
        this.requestSeek(state.startFrame);
      }
    }

    this.updateState({
      finished: state.finished || this.project.frame >= state.endFrame,
    });
    this.updateFrame(this.project.frame);

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
      if (time - this.renderTime >= 990 / this.state.fps) {
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
