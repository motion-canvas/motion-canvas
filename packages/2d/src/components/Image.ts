import {Signal} from '@motion-canvas/core/lib/utils';
import {computed, property} from '../decorators';
import {Layout, LayoutProps} from './Layout';

export interface ImageProps extends LayoutProps {
  src?: string;
}

export class Image extends Layout {
  @property()
  public declare readonly src: Signal<string, this>;
  protected readonly image: HTMLImageElement;

  public constructor(props: ImageProps) {
    super({
      ...props,
      tagName: 'img',
    });
    this.image = <HTMLImageElement>this.element;
  }

  protected override draw(context: CanvasRenderingContext2D) {
    const {width, height} = this.computedSize();

    context.drawImage(this.image, width / -2, height / -2, width, height);
    super.draw(context);
  }

  protected override updateLayout() {
    this.applySrc();
    super.updateLayout();
  }

  @computed()
  protected applySrc() {
    this.image.src = this.src();
  }

  protected override collectAsyncResources(deps: Promise<any>[]) {
    super.collectAsyncResources(deps);
    this.applySrc();
    if (!this.image.complete) {
      deps.push(
        new Promise((resolve, reject) => {
          this.image.addEventListener('load', resolve);
          this.image.addEventListener('error', reject);
        }),
      );
    }
  }
}
