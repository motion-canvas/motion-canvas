const path = require('path');
const {readdirSync} = require('fs');
const loadImage = require('../utils/load-image');
const nameRegex = /[^\d]*(\d+)\.png$/;

function loader() {
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

  files.forEach(file => this.addDependency(file));

  loadAnimation(files)
    .then(result => callback(null, result))
    .catch(error => callback(error));
}

async function loadAnimation(files) {
  const frames = [];
  for (const file of files) {
    frames.push(await loadImage(file));
  }

  return `export default ${JSON.stringify(frames)};`;
}

module.exports = loader;
