/// <reference types="vite/client" />

import 'vite/types/customEvent';

declare module 'vite/types/customEvent' {
  interface CustomEventMap {
    'motion-canvas:meta': {source: string; data: import('./Meta').Metadata};
    'motion-canvas:meta-ack': {source: string};
    'motion-canvas:export': {
      frame: number;
      data: string;
      mimeType: string;
      project: string;
    };
    'motion-canvas:export-ack': {frame: number};
    'motion-canvas:assets': {urls: string[]};
  }
}
