import {makeEditorPlugin} from '@motion-canvas/ui';
import {InspectorTabConfig} from './InspectorTabConfig';
import {PreviewOverlayConfig} from './PreviewOverlayConfig';
import {Provider} from './Provider';

export default makeEditorPlugin({
  name: '@motion-canvas/2d',
  provider: Provider,
  previewOverlay: PreviewOverlayConfig,
  tabs: [InspectorTabConfig],
});
