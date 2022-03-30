export class Controls {
  private play: HTMLInputElement;
  private loop: HTMLInputElement;
  private from: HTMLInputElement;
  private current: HTMLInputElement;
  private speed: HTMLInputElement;
  private fps: HTMLInputElement;
  private loadingIndicator: HTMLElement;
  private stepRequested: boolean = false;
  private resetRequested: boolean = false;
  private rendering: boolean = false;
  private lastUpdate: number = 0;
  private updateTimes: number[] = [];
  private overallTime: number = 0;
  private directory: FileSystemDirectoryHandle;

  public set loading(value: boolean) {
    this.loadingIndicator.hidden = !value;
  }

  public get isLooping(): boolean {
    return this.loop.checked;
  }

  public get startFrom(): number {
    return parseInt(this.from.value);
  }

  public get playbackSpeed(): number {
    return parseFloat(this.speed.value);
  }

  public get isRendering(): boolean {
    return this.rendering;
  }

  public constructor(private form: HTMLFormElement) {
    this.play = form.play;
    this.loop = form.loop;
    this.from = form.from;
    this.current = form.current;
    this.speed = form.speed;
    this.fps = form.fps;
    this.loadingIndicator = document.getElementById('loading');

    form.next.addEventListener('click', this.handleNext);
    form.refresh.addEventListener('click', this.handleReset);
    form.render.addEventListener('click', () => this.toggleRendering());
    this.current.addEventListener(
      'click',
      () => (this.from.value = this.current.value),
    );

    this.play.checked = localStorage.getItem('play') === 'true';
    this.play.addEventListener('change', () =>
      this.togglePlayback(this.play.checked),
    );

    document.addEventListener('keydown', event => {
      switch (event.key) {
        case ' ':
          event.preventDefault();
          this.togglePlayback();
          break;
        case 'ArrowRight':
          event.preventDefault();
          this.handleNext();
          break;
      }
    });
  }

  public consumeState() {
    const state = {
      isPlaying: this.play.checked || this.stepRequested,
      shouldReset: this.resetRequested,
    };

    this.stepRequested = false;
    this.resetRequested = false;

    return state;
  }

  public onReset() {
    this.overallTime = 0;
    this.updateTimes = [];
  }

  public onFrame(frame: number) {
    const passed = performance.now() - this.lastUpdate;

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

  public async onRender(frame: number, content: Blob) {
    const name = frame.toString().padStart(6, '0');
    const size = content.size / 1024;

    try {
      this.directory ??= await window.showDirectoryPicker();
      const file = await this.directory.getFileHandle(`frame-${name}.png`, {
        create: true,
      });
      const stream = await file.createWritable();
      await stream.write(content);
      await stream.close();
      console.log(`Frame: ${name}, Size: ${Math.round(size)} kB`);
      this.onFrame(frame);
    } catch (e) {
      console.error(e);
      await this.toggleRendering(false);
    }
  }

  private handleReset = () => {
    this.resetRequested = true;
  };

  private handleNext = () => {
    this.stepRequested = true;
  };

  private togglePlayback = (value?: boolean) => {
    this.play.checked = value ?? !this.play.checked;
    localStorage.setItem('play', this.play.checked ? 'true' : 'false');
  };

  public toggleRendering = async (value?: boolean) => {
    this.rendering = value ?? !this.rendering;
  };
}
