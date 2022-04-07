import {Grid} from '../components/Grid';
import {Player} from './Player';
import {Vector2d} from 'konva/lib/types';

const ZOOM_SPEED = 0.05;
const STORAGE_KEY = 'navigator-state';

interface NavigatorState {
  position: Vector2d;
  scale: number;
  gridVisible: boolean;
}

export class Navigator {
  private readonly state: NavigatorState = {
    position: {x: 0, y: 0},
    scale: 1,
    gridVisible: false,
  };

  private isPanning = false;
  private startPosition = {x: 0, y: 0};
  private panStartPosition = {x: 0, y: 0};

  private readonly grid: Grid;
  private gridZoom: number = null;

  public constructor(
    private readonly player: Player,
    private readonly root: HTMLElement,
  ) {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      this.state = JSON.parse(savedState);
    }

    this.grid = new Grid({
      ...player.project.center,
      ...player.project.size(),
      strokeWidth: 2,
      stroke: 'rgba(255, 255, 255, 0.32',
      subdivision: true,
    });
    player.project.foreground.add(this.grid);
    player.project.foreground.drawScene();

    document.addEventListener('wheel', this.handleWheel);
    document.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('keydown', event => {
      switch (event.key) {
        case '0':
          this.state.scale = 1;
          this.state.position = {x: 0, y: 0};
          this.update();
          break;
        case '=':
          this.state.scale *= 1 + ZOOM_SPEED;
          this.update();
          break;
        case '-':
          this.state.scale *= 1 - ZOOM_SPEED;
          this.update();
          break;
        case "'":
          this.state.gridVisible = !this.state.gridVisible;
          this.update();
          break;
      }
    });

    this.update();
  }

  private handleWheel = (event: WheelEvent) => {
    if (this.isPanning) return;

    const pointer = {
      x: event.x - document.body.offsetWidth / 2,
      y: event.y - document.body.offsetHeight / 2,
    };

    const ratio = 1 - Math.sign(event.deltaY) * ZOOM_SPEED;
    this.state.scale *= ratio;

    this.state.position = {
      x: pointer.x + (this.state.position.x - pointer.x) * ratio,
      y: pointer.y + (this.state.position.y - pointer.y) * ratio,
    };

    this.update();
  };

  private handleMouseDown = (event: MouseEvent) => {
    if (event.button === 1) {
      event.preventDefault();
      this.isPanning = true;
      this.startPosition = {...this.state.position};
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
      this.state.position = {
        x: this.startPosition.x - this.panStartPosition.x + event.x,
        y: this.startPosition.y - this.panStartPosition.y + event.y,
      };
      this.update();
    }
  };

  private update() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));

    this.root.style.transform = `translate(${this.state.position.x}px, ${this.state.position.y}px) scale(${this.state.scale})`;
    if (this.state.gridVisible) {
      const newZoom = Math.min(
        Math.pow(2, Math.round(Math.log2(this.state.scale))),
        2,
      );
      if (newZoom !== this.gridZoom) {
        this.gridZoom = newZoom;
        this.grid.gridSize(80 / newZoom);
        this.player.project.foreground.drawScene();
      }
    }
    if (this.grid.visible() !== this.state.gridVisible) {
      this.grid.visible(this.state.gridVisible);
      this.player.project.foreground.drawScene();
    }
  }
}
