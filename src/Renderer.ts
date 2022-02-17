import type {Project} from './Project';
import {Util} from 'konva/lib/Util';

export const Renderer =
  (factory: () => Project) => (createCanvas: any, Image: any) => {
    Util.createCanvasElement = () => {
      const node = createCanvas(300, 300);
      const monkey = node.getContext;
      node.getContext = (type: string, options: Record<any, any>) => {
        return monkey.call(node, type, {
          ...options,
          pixelFormat: 'RGB30',
        });
      };
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
