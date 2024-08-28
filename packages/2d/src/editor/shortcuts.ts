import {makeShortcuts} from '@motion-canvas/ui';
export const SCENE_GRAPH_SHORTCUTS = makeShortcuts('scene-graph', {
  moveUp: {
    display: '↑',
    description: 'Go up',
    key: 'ArrowUp',
    modifiers: {},
  },
  modeDown: {
    display: '↓',
    description: 'Go down',
    key: 'ArrowDown',
    modifiers: {},
  },
  expandOrMoveDown: {
    display: '→',
    description: 'Expand / Enter',
    key: 'ArrowRight',
    modifiers: {},
  },
  collapseOrMoveUp: {
    display: '←',
    description: 'Collapse / Leave',
    key: 'ArrowLeft',
    modifiers: {},
  },
});
