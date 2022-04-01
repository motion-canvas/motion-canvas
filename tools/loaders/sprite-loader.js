const loadImage = require('../utils/load-image');

function loader() {
  const callback = this.async();
  loadImage(this.resourcePath)
    .then(sprite => callback(null, `export default ${JSON.stringify(sprite)}`))
    .catch(error => callback(error));
}

module.exports = loader;
