const path = require('path');
const {readdirSync} = require('fs');
const loadImage = require('../utils/load-image');
const nameRegex = /([^\d]*)\d+\.png$/;

module.exports = function () {
  const callback = this.async();
  const directoryPath = path.dirname(this.resourcePath);
  const files = readdirSync(directoryPath)
    .filter(file => nameRegex.test(file))
    .map(file => path.resolve(directoryPath, file));

  files.forEach(file => this.addDependency(file));

  loadAnimation(files)
    .then(result => callback(null, result))
    .catch(error => callback(error));
};

async function loadAnimation(files) {
  const frames = [];
  for (const file of files) {
    frames.push(await loadImage(file));
  }

  return `export default ${JSON.stringify(frames)};`;
}


