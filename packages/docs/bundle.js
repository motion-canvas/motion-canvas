const fs = require('fs');
const crypto = require('crypto');

const AssetPath = '/modules';
const PublicPath = './static/modules';

module.exports = () => ({
  name: 'docusaurus-bundle-plugin',
  async loadContent() {
    if (!fs.existsSync(PublicPath)) {
      fs.mkdirSync(PublicPath, {recursive: true});
    }

    return await Promise.all([copyBundle('core'), copyBundle('2d')]);
  },
  injectHtmlTags({content: [core, two]}) {
    return {
      headTags: [
        {
          tagName: 'script',
          attributes: {
            type: 'importmap',
          },
          innerHTML: JSON.stringify({
            imports: {
              '@motion-canvas/core': `${core}`,
              '@motion-canvas/2d': `${two}`,
              '@motion-canvas/2d/jsx-runtime': `${two}`,
            },
          }),
        },
      ],
    };
  },
});

async function copyBundle(name) {
  const bundle = `../${name}/dist/index.js`;
  if (!fs.existsSync(bundle)) {
    throw `The '${name}' bundle is missing.\n\tMake sure to first run:\n\tnpm run ${name}:bundle\n`;
  }
  const fileContents = await fs.promises.readFile(bundle);
  const hash = crypto
    .createHash('md5')
    .update(fileContents)
    .digest('hex')
    .slice(0, 8);
  const fileName = `${name}-${hash}.js`;
  await fs.promises.writeFile(`${PublicPath}/${fileName}`, fileContents);

  return `${AssetPath}/${fileName}`;
}
