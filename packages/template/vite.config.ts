import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import legacyRenderer from '@motion-canvas/legacy/vite';

export default defineConfig({
  plugins: [motionCanvas(), legacyRenderer()],
});
