import './index.css';

import {makeEditorPlugin} from '@motion-canvas/ui';
import {NodeInspectorConfig} from './NodeInspectorConfig';
import {PreviewOverlayConfig} from './PreviewOverlayConfig';
import {Provider} from './Provider';
import {SceneGraphTabConfig} from './SceneGraphTabConfig';
import {SCENE_GRAPH_SHORTCUTS} from './shortcuts';

export default makeEditorPlugin(() => {
  return {
    name: '@motion-canvas/2d',
    provider: Provider,
    previewOverlay: PreviewOverlayConfig,
    tabs: [SceneGraphTabConfig],
    inspectors: [NodeInspectorConfig],
    shortcuts: [SCENE_GRAPH_SHORTCUTS],
  };
});
