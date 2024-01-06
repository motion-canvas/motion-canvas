import './index.css';

import {makeEditorPlugin} from '@motion-canvas/ui';
import {PreviewOverlayConfig} from './PreviewOverlayConfig';
import {Provider} from './Provider';
import {SceneGraphTabConfig} from './SceneGraphTabConfig';

export default makeEditorPlugin(() => {
  return {
    name: '@motion-canvas/2d',
    provider: Provider,
    previewOverlay: PreviewOverlayConfig,
    tabs: [SceneGraphTabConfig],
  };
});
