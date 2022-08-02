const path = require('path');
const {readdirSync} = require('fs');
const nameRegex = /\D*(\d+)\.png$/;

function animationLoader() {
  const callback = this.async();
  const directoryPath = path.dirname(this.resourcePath);

  const files = readdirSync(directoryPath)
    .map(file => nameRegex.exec(file))
    .filter(match => !!match)
    .map(match => [match.input, parseInt(match[1])])
    .sort(([, indexA], [, indexB]) =>
      indexA < indexB ? -1 : indexA > indexB ? 1 : 0,
    )
    .map(([file]) => path.resolve(directoryPath, file));

  loadAnimation(files, this.importModule)
    .then(code => callback(null, code))
    .catch(error => callback(error));
}

async function loadAnimation(files, importModule) {
  const urls = await Promise.all(files.map(file => importModule(file)));

  return `import {loadAnimation} from '@motion-canvas/core/lib/media';
export default loadAnimation(${JSON.stringify(urls)});`;
}

module.exports = animationLoader;
