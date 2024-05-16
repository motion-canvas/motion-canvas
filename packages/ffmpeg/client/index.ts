import type {ExporterClass} from '@motion-canvas/core';
import {makePlugin} from '@motion-canvas/core';
import {FFmpegExporterClient} from './FFmpegExporterClient';

export default makePlugin({
  name: 'ffmpeg-plugin',
  exporters(): ExporterClass[] {
    return [FFmpegExporterClient];
  },
});
