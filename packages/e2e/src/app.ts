import * as path from 'path';
import puppeteer, {Page} from 'puppeteer';
import {fileURLToPath} from 'url';
import {createServer} from 'vite';

const Root = fileURLToPath(new URL('.', import.meta.url));

export interface App {
  page: Page;
  stop: () => Promise<void>;
}

export async function start(): Promise<App> {
  const [browser, server] = await Promise.all([
    puppeteer.launch({
      headless: 'new',
    }),
    createServer({
      root: Root,
      configFile: path.resolve(Root, '../vite.config.ts'),
      server: {
        port: 9000,
      },
    }).then(server => server.listen()),
  ]);

  const page = await browser.newPage();
  await page.goto('http://localhost:9000');

  return {
    page,
    async stop() {
      await Promise.all([browser.close(), server.close()]);
    },
  };
}
