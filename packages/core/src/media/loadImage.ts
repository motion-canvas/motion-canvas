import {getContext} from '../utils';

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

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
  canvas ??= document.createElement('canvas');
  context ??= getContext(canvas);

  canvas.width = image.width;
  canvas.height = image.height;
  context.clearRect(0, 0, image.width, image.height);
  context.drawImage(image, 0, 0);

  return context.getImageData(0, 0, image.width, image.height);
}
