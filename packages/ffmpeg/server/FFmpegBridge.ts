import {PluginConfig} from '@motion-canvas/vite-plugin';
import type {WebSocketServer} from 'vite';
import {
  FFmpegExporterServer,
  FFmpegExporterSettings,
} from './FFmpegExporterServer';

interface BrowserRequest {
  method: string;
  data: unknown;
}

/**
 * A simple bridge between the FFmpegExporterServer and FFmpegExporterClient.
 *
 * @remarks
 * This class lets the client exporter invoke methods on the server and receive
 * responses using a simple Promise-based API.
 */
export class FFmpegBridge {
  private process: FFmpegExporterServer | null = null;

  public constructor(
    private readonly ws: WebSocketServer,
    private readonly config: PluginConfig,
  ) {
    ws.on('motion-canvas/ffmpeg', this.handleMessage);
  }

  private handleMessage = async ({method, data}: BrowserRequest) => {
    if (method === 'start') {
      try {
        this.process = new FFmpegExporterServer(
          data as FFmpegExporterSettings,
          this.config,
        );
        this.respondSuccess(method, await this.process.start());
      } catch (e: any) {
        this.respondError(method, e?.message);
      }
      return;
    }

    if (!this.process) {
      this.respondError(method, 'The exporting process has not been started.');
      return;
    }

    if (!(method in this.process)) {
      this.respondError(method, `Unknown method: "${method}".`);
      return;
    }

    try {
      this.respondSuccess(method, await (this.process as any)[method](data));
    } catch (e: any) {
      this.respondError(method, e?.message);
    }

    if (method === 'end') {
      this.process = null;
    }
  };

  private respondSuccess(method: string, data: any = {}) {
    this.ws.send('motion-canvas/ffmpeg-ack', {
      status: 'success',
      method,
      data,
    });
  }

  private respondError(method: string, message = 'Unknown error.') {
    this.ws.send('motion-canvas/ffmpeg-ack', {
      status: 'error',
      method,
      message,
    });
  }
}
