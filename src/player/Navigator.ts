const ZOOM_SPEED = 0.05;

export class Navigator {
  private scale = 1;
  private isPanning = false;
  private startPosition = {x: 0, y: 0};
  private panStartPosition = {x: 0, y: 0};
  private position = {x: 0, y: 0};

  public constructor(private readonly root: HTMLElement) {
    document.addEventListener('wheel', this.handleWheel);
    document.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('mousemove', this.handleMouseMove);

    document.addEventListener('keydown', event => {
      switch (event.key) {
        case '0':
          this.scale = 1;
          this.position = {x: 0, y: 0};
          this.update();
          break;
        case '=':
          this.scale *= 1 + ZOOM_SPEED;
          this.update();
          break;
        case '-':
          this.scale *= 1 - ZOOM_SPEED;
          this.update();
          break;
      }
    });
  }

  private handleWheel = (event: WheelEvent) => {
    if (this.isPanning) return;

    const pointer = {
      x: event.x - document.body.offsetWidth / 2,
      y: event.y - document.body.offsetHeight / 2,
    };

    const ratio = 1 - Math.sign(event.deltaY) * ZOOM_SPEED;
    this.scale *= ratio;

    this.position = {
      x: pointer.x + (this.position.x - pointer.x) * ratio,
      y: pointer.y + (this.position.y - pointer.y) * ratio,
    };

    this.update();
  };

  private handleMouseDown = (event: MouseEvent) => {
    if (event.button === 1) {
      event.preventDefault();
      this.isPanning = true;
      this.startPosition = {...this.position};
      this.panStartPosition = {x: event.x, y: event.y};
    }
  };

  private handleMouseUp = (event: MouseEvent) => {
    if (event.button === 1) {
      event.preventDefault();
      this.isPanning = false;
    }
  };

  private handleMouseMove = (event: MouseEvent) => {
    if (this.isPanning) {
      this.position = {
        x: this.startPosition.x - this.panStartPosition.x + event.x,
        y: this.startPosition.y - this.panStartPosition.y + event.y,
      };
      this.update();
    }
  };

  private update() {
    this.root.style.transform = `translate(${this.position.x}px, ${this.position.y}px) scale(${this.scale})`;
  }
}
