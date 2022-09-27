import {Node, NodeProps} from './Node';
import {Signal} from '@motion-canvas/core/lib/utils';
import {computed, property} from '../decorators';

export interface ImageProps extends NodeProps {
  src?: string;
}

export class Image extends Node<ImageProps> {
  @property()
  public declare readonly src: Signal<string, this>;

  public constructor(props: ImageProps) {
    super({
      ...props,
      layout: props.layout
        ? {...props.layout, tagName: 'img'}
        : {tagName: 'img'},
    });
  }

  protected override draw(context: CanvasRenderingContext2D) {
    const image = <HTMLImageElement>this.layout.element;
    const {width, height} = this.computedSize();

    context.drawImage(image, width / -2, height / -2, width, height);
    super.draw(context);
  }

  protected override applyLayoutChanges() {
    this.applySrc();
  }

  @computed()
  protected applySrc() {
    const src = this.src();
    const image = <HTMLImageElement>this.layout.element;
    image.src = src;
    return image;
  }

  protected override collectAsyncResources(deps: Promise<any>[]) {
    super.collectAsyncResources(deps);
    const image = this.applySrc();
    if (!image.complete) {
      deps.push(
        new Promise(resolve => {
          image.addEventListener('load', () => resolve(this));
        }),
      );
    }
  }
}
