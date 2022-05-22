const {exec} = require('child_process');
const {promises: fs} = require('fs');
const loaderUtils = require('loader-utils');
const path = require('path');

function loader() {
  const source = this.resourcePath;
  const destination = source.slice(0, -4) + '.json';

  const callback = this.async();
  exec(
    `..\\bin\\audiowaveform.exe -i ${source} -o ${destination}`,
    {cwd: __dirname},
    (error, stdout) => {
      if (error) {
        callback(error);
        return;
      }

      fs.readFile(destination, 'utf8')
        .then(data => callback(null, `export default ${data};`))
        .catch(callback);
    },
  );
}

module.exports = loader;
