import {createContext} from 'preact';
import {useContext} from 'preact/hooks';

export interface ViewportState {
  width: number;
  height: number;
  x: number;
  y: number;
  size: {x: number; y: number};
  zoom: number;
  grid: boolean;
}

const ViewportContext = createContext<ViewportState>({
  width: 1920,
  height: 1080,
  x: 0,
  y: 0,
  size: {x: 0, y: 0},
  zoom: 1,
  grid: false,
});

export const ViewportProvider = ViewportContext.Provider;
export function useViewportContext() {
  return useContext(ViewportContext);
}
