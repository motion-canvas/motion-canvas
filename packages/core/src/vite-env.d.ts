/// <reference types="vite/client" />

import 'vite/types/customEvent';

declare module 'vite/types/customEvent' {
  interface CustomEventMap {
    'motion-canvas:meta': {source: string; data: any};
    'motion-canvas:meta-ack': {source: string};
    'motion-canvas:export': {
      data: string;
      subDirectories: string[];
      mimeType: string;
      frame: number;
      name: string;
    };
    'motion-canvas:export-ack': {frame: number};
    'motion-canvas:assets': {urls: string[]};
  }
}
