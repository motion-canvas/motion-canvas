import {LogPayload, RendererSettings} from '@motion-canvas/core';
import {PLUGIN_OPTIONS, Plugin} from '@motion-canvas/vite-plugin';
import {SingleBar} from 'cli-progress';
import kleur from 'kleur';

declare global {
  interface Window {
    handleLog(payload: LogPayload): void;
    handleRenderStart(): void;
    handleRenderEnd(result: string): void;
    handleRender(frame: number, duration: number): void;
  }
}

interface Config {
  output?: string;
  project?: string;
  debug?: boolean;
  product: 'chrome' | 'firefox';
}

export async function render(
  config: Config,
  settings: Partial<RendererSettings> = {},
) {
  const spinner = (await import('ora'))
    .default('Launching headless browser...\n')
    .start();

  const {createServer} = await import('vite');
  const puppeteer = await import('puppeteer');
  const [browser, server] = await Promise.all([
    puppeteer.launch({
      product: config.product,
      headless: !config.debug,
      protocol: config.product === 'chrome' ? 'cdp' : 'webDriverBiDi',
    }),
    createServer({
      plugins: [
        {
          name: 'renderer-plugin',
          [PLUGIN_OPTIONS]: {
            async config() {
              if (config.output) {
                return {output: config.output};
              }
            },
          },
        } as Plugin,
      ],
    }).then(server => server.listen()),
  ]);

  const page = await browser.newPage();
  const resultPromise = new Promise<string>((resolve, reject) => {
    page.on('pageerror', ({message}) => reject(message));
    page.exposeFunction('handleRenderEnd', (result: string) => {
      resolve(result);
    });
  });

  const bar = new SingleBar({
    format:
      'Rendering {bar} {percentage}% | ETA: {eta}s | Frame {value}/{total}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  });
  await page.exposeFunction('handleRender', (frame: number, total: number) => {
    bar.setTotal(total);
    bar.update(frame);
  });

  const payloads: LogPayload[] = [];
  await page.exposeFunction('handleLog', (payload: LogPayload) => {
    payloads.push(payload);
  });

  await page.exposeFunction('handleRenderStart', () => {
    spinner.stop();
    bar.start(1, 0);
  });

  await page.evaluateOnNewDocument(() => {
    window.addEventListener('render', ((event: CustomEvent) => {
      window.handleRender(event.detail.frame, event.detail.total);
    }) as EventListener);
    window.addEventListener('renderend', ((event: CustomEvent) => {
      window.handleRenderEnd(event.detail);
    }) as EventListener);
    window.addEventListener('renderstart', (() => {
      window.handleRenderStart();
    }) as EventListener);
    window.addEventListener('log', ((event: CustomEvent) => {
      window.handleLog(event.detail);
    }) as EventListener);
  });

  const url = new URL(`http://localhost`);
  url.port = server.config.server.port!.toString();
  url.searchParams.set('headless', JSON.stringify(settings));
  if (config.project) {
    url.pathname = config.project;
  }

  spinner.text = `Loading project...\n`;
  await page.goto(url.toString());
  const result = await resultPromise;
  bar.stop();

  for (const payload of payloads) {
    printLog(payload);
  }

  switch (result) {
    case 'success':
      console.log(kleur.green('√ Rendering complete.'));
      break;
    case 'aborted':
      console.log(kleur.yellow('! Rendering aborted.'));
      break;
    case 'error':
      console.log(kleur.red('× Rendering failed.'));
      break;
  }

  if (!config.debug) {
    await Promise.all([browser.close(), server.close()]);
  }
}

function printLog(payload: LogPayload) {
  const level = payload.level ?? 'unknown';
  switch (level) {
    case 'error':
      console.log(kleur.red(`[${level.toUpperCase()}] ${payload.message}`));
      break;
    case 'warn':
      console.log(kleur.yellow(`[${level.toUpperCase()}] ${payload.message}`));
      break;
    default:
      console.log(`[${level.toUpperCase()}] ${payload.message}`);
      break;
  }

  if (payload.stack) {
    console.log(kleur.bold('Stack trace:'));
    console.log(payload.stack);
  }
}
