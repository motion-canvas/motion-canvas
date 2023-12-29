import {createContext} from 'preact';
import {useContext} from 'preact/hooks';

export interface ViewportState {
  x: number;
  y: number;
  rect: DOMRectReadOnly;
  zoom: number;
  grid: boolean;
  resolutionScale: number;
}

const ViewportContext = createContext<ViewportState>({
  x: 0,
  y: 0,
  rect: new DOMRectReadOnly(),
  zoom: 1,
  grid: false,
  resolutionScale: 1,
});

export const ViewportProvider = ViewportContext.Provider;
export function useViewportContext() {
  return useContext(ViewportContext);
}
