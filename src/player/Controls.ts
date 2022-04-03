import {Player, PlayerRenderEvent, PlayerState} from './Player';

export class Controls {
  private play: HTMLInputElement;
  private loop: HTMLInputElement;
  private from: HTMLInputElement;
  private current: HTMLInputElement;
  private speed: HTMLInputElement;
  private fps: HTMLInputElement;
  private loadingIndicator: HTMLElement;
  private lastUpdate: number = 0;
  private updateTimes: number[] = [];
  private overallTime: number = 0;
  private directory: FileSystemDirectoryHandle;

  public constructor(
    private readonly player: Player,
    private readonly form: HTMLFormElement,
  ) {
    this.play = form.play;
    this.loop = form.loop;
    this.from = form.from;
    this.current = form.current;
    this.speed = form.speed;
    this.fps = form.fps;
    this.loadingIndicator = document.getElementById('loading');

    this.play.addEventListener('change', () =>
      this.player.togglePlayback(this.play.checked),
    );
    this.loop.addEventListener('change', () =>
      this.player.updateState({loop: this.loop.checked}),
    );
    this.from.addEventListener('change', () =>
      this.player.updateState({startFrame: parseInt(this.from.value)}),
    );
    this.speed.addEventListener('change', () =>
      this.player.updateState({speed: parseFloat(this.speed.value)}),
    );

    form.refresh.addEventListener('click', () => this.player.requestReset());
    form.next.addEventListener('click', () => this.player.requestNextFrame());
    form.render.addEventListener('click', () => this.player.toggleRendering());

    this.current.addEventListener('click', () =>
      this.player.updateState({startFrame: parseInt(this.current.value)}),
    );

    document.addEventListener('keydown', event => {
      switch (event.key) {
        case ' ':
          event.preventDefault();
          this.player.togglePlayback();
          break;
        case 'ArrowRight':
          event.preventDefault();
          this.player.requestNextFrame();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          this.player.requestReset();
          break;
      }
    });

    this.player.StateChanged.sub(this.handleStateUpdate);
    this.player.RenderChanged.sub(this.handleRenderChange);
  }

  public handleStateUpdate = (state: PlayerState) => {
    if (state.frame === state.startFrame || state.frame === 0) {
      this.overallTime = 0;
      this.updateTimes = [];
    }

    this.updateFramerate(state.frame);
    this.play.checked = !state.paused;
    this.loop.checked = state.loop;
    this.from.value = state.startFrame.toString();
    this.current.value = state.frame.toString();
    this.speed.value = state.speed.toString();
    this.loadingIndicator.hidden = !state.loading;
  };

  private previousFrame: number = 0;
  public updateFramerate(frame: number) {
    const passed = performance.now() - this.lastUpdate;

    if (this.previousFrame === frame) return;
    this.previousFrame = frame;

    this.overallTime += passed;
    this.updateTimes.push(passed);
    if (this.updateTimes.length > 10) {
      this.overallTime -= this.updateTimes.shift();
    }

    const average = this.overallTime / this.updateTimes.length;
    this.fps.value = Math.floor(1000 / average).toString();
    this.current.value = Math.floor(frame).toString();

    this.lastUpdate = performance.now();
  }

  public handleRenderChange = async ({frame, blob}: PlayerRenderEvent) => {
    const name = frame.toString().padStart(6, '0');
    const size = blob.size / 1024;

    try {
      this.directory ??= await window.showDirectoryPicker();
      const file = await this.directory.getFileHandle(`frame-${name}.png`, {
        create: true,
      });
      const stream = await file.createWritable();
      await stream.write(blob);
      await stream.close();
      console.log(`Frame: ${name}, Size: ${Math.round(size)} kB`);
      this.updateFramerate(frame);
    } catch (e) {
      console.error(e);
      this.player.toggleRendering(false);
    }
  };
}
