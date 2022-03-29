const loadImage = require('../utils/load-image');

module.exports = function () {
  const callback = this.async();
  loadImage(this.resourcePath)
    .then(sprite => callback(null, `export default ${JSON.stringify(sprite)}`))
    .catch(error => callback(error));
};
