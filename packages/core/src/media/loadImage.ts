import {getContext} from '../utils';

let Canvas: HTMLCanvasElement;
let Context: CanvasRenderingContext2D;

export type ImageDataSource = CanvasImageSource & {
  width: number;
  height: number;
};

export function loadImage(source: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = source;
  return new Promise((resolve, reject) => {
    if (image.complete) {
      resolve(image);
    } else {
      image.onload = () => resolve(image);
      image.onerror = reject;
    }
  });
}

export function loadAnimation(sources: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(sources.map(loadImage));
}

export function getImageData(image: ImageDataSource) {
  Canvas ??= document.createElement('canvas');
  Context ??= getContext({willReadFrequently: true}, Canvas);

  Canvas.width = image.width;
  Canvas.height = image.height;
  Context.clearRect(0, 0, image.width, image.height);
  Context.drawImage(image, 0, 0);

  return Context.getImageData(0, 0, image.width, image.height);
}
