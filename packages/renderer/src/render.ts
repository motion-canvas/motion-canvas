import * as path from 'path';
import puppeteer from 'puppeteer';
import {createServer} from 'vite';
import {fileURLToPath} from 'url';

const Root = fileURLToPath(new URL('.', import.meta.url));

(async () => {
  console.log('Rendering...');

  const [browser] = await Promise.all([
    puppeteer.launch({headless: false}),
    createServer({
      root: Root,
      configFile: path.resolve(Root, '../vite.config.ts'),
      server: {
        port: 9000,
      },
    }).then(server => server.listen()),
  ]);

  const page = await browser.newPage();
  await page.goto('http://localhost:9000/project/renderer');
})();
