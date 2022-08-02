import {Size} from '../types';

const imageLookup: Record<string, HTMLImageElement> = {};
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

export type ImageDataSource = CanvasImageSource & Size;

export async function loadImage(source: string): Promise<HTMLImageElement> {
  if (!imageLookup[source]) {
    const image = new Image();
    imageLookup[source] = image;
    image.src = source;
    await new Promise(resolve => (image.onload = resolve));
  }

  return imageLookup[source];
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
