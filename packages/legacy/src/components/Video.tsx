import {Shape, ShapeConfig} from 'konva/lib/Shape';
import {threadable} from '@motion-canvas/core/lib/decorators';
import {getset} from '../decorators';
import {Context} from 'konva/lib/Context';
import {GetSet} from 'konva/lib/types';
import {cancel, ThreadGenerator} from '@motion-canvas/core/lib/threading';
import {waitFor} from '@motion-canvas/core/lib/flow';
import {GeneratorHelper} from '@motion-canvas/core/lib/helpers';
import {CanvasHelper} from '../helpers';

interface VideoConfig extends ShapeConfig {
  frames: ImageBitmap[];
  frame?: number;
  fps?: number;
  playing?: number;
  radius?: number;
}

export class Video extends Shape {
  @getset([])
  public frames: GetSet<VideoConfig['frames'], this>;
  @getset(0)
  public frame: GetSet<VideoConfig['frame'], this>;
  @getset(30)
  public fps: GetSet<VideoConfig['fps'], this>;
  @getset(true)
  public playing: GetSet<VideoConfig['playing'], this>;
  @getset(8)
  public radius: GetSet<VideoConfig['radius'], this>;

  private task: ThreadGenerator | null = null;

  public constructor(config?: VideoConfig) {
    super(config);
  }

  public _sceneFunc(context: Context) {
    const frames = this.frames();
    context._context.clip(
      CanvasHelper.roundRectPath(
        new Path2D(),
        0,
        0,
        this.width(),
        this.height(),
        this.radius(),
      ),
    );
    if (frames.length) {
      context.drawImage(frames[this.frame() % frames.length], 0, 0);
    } else {
      context._context.fillStyle = '#666666';
      context.fillRect(0, 0, this.width(), this.height());
    }
  }

  public play(): ThreadGenerator {
    const runTask = this.playRunner();
    if (this.task) {
      const previousTask = this.task;
      this.task = (function* (): ThreadGenerator {
        cancel(previousTask);
        yield* runTask;
      })();
      GeneratorHelper.makeThreadable(this.task, runTask);
    } else {
      this.task = runTask;
    }

    return this.task;
  }

  @threadable()
  public *stop() {
    if (this.task) {
      cancel(this.task);
      this.task = null;
    }
  }

  @threadable('videoRunner')
  private *playRunner(): ThreadGenerator {
    while (this.task !== null) {
      if (this.playing()) {
        this.frame(this.frame() + 1);
      }
      yield* waitFor(1 / this.fps());
    }
  }
}
