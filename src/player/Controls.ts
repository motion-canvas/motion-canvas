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
  private lastUpdate: number = 0;
  private updateTimes: number[] = [];
  private overallTime: number = 0;

  public set loading(value: boolean) {
    this.loadingIndicator.hidden = !value;
  }

  public get isPlaying(): boolean {
    if (this.stepRequested) {
      this.stepRequested = false;
      return true;
    }

    return this.play.checked;
  }

  public get isLooping(): boolean {
    return this.loop.checked;
  }

  public get startFrom(): number {
    return parseInt(this.from.value);
  }

  public get shouldReset(): boolean {
    if (this.resetRequested) {
      this.resetRequested = false;
      return true;
    }

    return false;
  }

  public get playbackSpeed(): number {
    return parseFloat(this.speed.value);
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

    this.play.checked = localStorage.getItem('play') === 'true';
    this.play.addEventListener('change', () => this.toggle(this.play.checked));

    document.addEventListener('keydown', event => {
      switch (event.key) {
        case ' ':
          this.toggle();
          break;
        case 'ArrowRight':
          this.handleNext();
          break;
      }
    });
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

  private handleReset = () => {
    this.resetRequested = true;
  }

  private handleNext = () => {
    this.stepRequested = true;
  }

  private toggle = (value?: boolean) => {
    this.play.checked = value ?? !this.play.checked;
    localStorage.setItem('play', this.play.checked ? 'true' : 'false');
  }
}