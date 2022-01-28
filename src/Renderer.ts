import type {Project} from './Project';
import {Util} from 'konva/lib/Util';

export const Renderer =
  (factory: () => Project) => (createCanvas: any, Image: any) => {
    Util.createCanvasElement = () => {
      const node = createCanvas(300, 300);
      if (!node['style']) {
        node['style'] = {};
      }
      return node;
    };
    Util.createImageElement = () => {
      return new Image();
    };

    return factory();
  };
