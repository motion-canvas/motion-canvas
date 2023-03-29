import fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';
import {createServer} from 'vite';
import {fileURLToPath} from 'url';

const Root = fileURLToPath(new URL('.', import.meta.url));

(async () => {
  console.log('Rendering...');

  const project = process.argv[2];
  const metaPath = `${Root}/../../template/src/${project}.meta`;
  if (!fs.existsSync(metaPath))
    return console.log(`Project couldn't be found.`);

  const [browser, server] = await Promise.all([
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
  await page.goto(`http://localhost:9000/${project}/renderer`);

  await page.exposeFunction('onRenderComplete', async () => {
    await Promise.all([browser.close(), server.close()]);
  });
})();
