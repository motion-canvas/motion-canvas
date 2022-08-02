function imageLoader() {
  const callback = this.async();
  loadImage(this.resourcePath, this.importModule)
    .then(code => callback(null, code))
    .catch(error => callback(error));
}

async function loadImage(fileName, importModule) {
  const url = await importModule(fileName);

  return `import {loadImage} from '@motion-canvas/core/lib/media';
export default loadImage('${url}');`;
}

module.exports = imageLoader;
