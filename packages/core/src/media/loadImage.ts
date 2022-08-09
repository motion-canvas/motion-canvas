import {Size} from '../types';

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

export type ImageDataSource = CanvasImageSource & Size;

export function loadImage(source: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = source;
  return new Promise(resolve => {
    image.onload = () => resolve(image);
  });
}

export function loadAnimation(sources: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(sources.map(loadImage));
}

export function getImageData(image: ImageDataSource) {
  canvas.width = image.width;
  canvas.height = image.height;
  context.clearRect(0, 0, image.width, image.height);
  context.drawImage(image, 0, 0);

  return context.getImageData(0, 0, image.width, image.height);
}
