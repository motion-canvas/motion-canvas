import {createContext} from 'preact';
import type {InspectedElement} from '@motion-canvas/core/lib/scenes';

export interface AppState {
  inspectedElement: InspectedElement | null;
  setInspectedElement: (element: InspectedElement | null) => void;
}

const AppContext = createContext<AppState>({
  inspectedElement: null,
  setInspectedElement: () => {
    throw new Error('setSelectedNode not implemented');
  },
});

export {AppContext};
