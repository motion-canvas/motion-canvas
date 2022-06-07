import HtmlWebpackPlugin from 'html-webpack-plugin';

export default class UIPlugin {
  constructor(config) {
    this.name = 'UIPlugin';
    this.config = config;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(this.name, compilation => {
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
        this.name,
        (data, cb) => {
          data.assets.js.push(
            this.config.uiServer ? this.config.uiPath : 'ui/main.js',
          );
          data.assets.favicon = 'data:;base64,iVBORw0KGgo=';
          cb(null, data);
        },
      );
    });
  }
}
