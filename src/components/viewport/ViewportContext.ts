import {createContext} from 'preact';

export interface ViewportState {
  width: number;
  height: number;
  x: number;
  y: number;
  zoom: number;
  grid: boolean;
}

const ViewportContext = createContext<ViewportState>({
  width: 1920,
  height: 1080,
  x: 0,
  y: 0,
  zoom: 1,
  grid: false,
});

export {ViewportContext};
