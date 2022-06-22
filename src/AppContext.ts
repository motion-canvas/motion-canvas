import {createContext} from 'preact';
import {Node} from 'konva/lib/Node';

export interface AppState {
  selectedNode: Node | null;
  setSelectedNode: (node: Node | null) => void;
}

const AppContext = createContext<AppState>({
  selectedNode: null,
  setSelectedNode: () => {
    throw new Error('setSelectedNode not implemented');
  },
});

export {AppContext};
