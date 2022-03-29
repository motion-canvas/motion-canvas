module.exports = function (source) {
  const json = {};
  source.split(/\r?\n/).forEach(line => {
    if (!line) return;
    const parts = line.split('\t');
    json[parts[2]] = parseFloat(parts[0]);
  });

  return `
const json = ${JSON.stringify(json)};
const proxy = new Proxy(json, {
    get(target, prop) {
        if (target[prop]) {
            return target[prop];
        } else {
            console.warn('Missing label:', prop);
            return 0;
        }
    }
});

export default proxy;
`;
};
