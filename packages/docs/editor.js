const fs = require('fs');

module.exports = (context, options) => ({
  name: 'docusaurus-editor-plugin',
  async loadContent() {
    const editorFile = await fs.promises.readFile('../ui/editor.html');
    const html = editorFile
      .toString()
      .replace('{{style}}', '/editor/style.css')
      .replace('{{source}}', './project.js');

    const examples = options.examples ?? [];
    for (const {fileName} of examples) {
      const dir = `./static/editor/${fileName}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
      }

      await fs.promises.writeFile(`${dir}/index.html`, html);
      await fs.promises.writeFile(
        `${dir}/project.js`,
        `import project from '/examples/${fileName}.js';` +
          `import {editor} from '/editor/main.js';` +
          `editor(project);`,
      );
    }

    await fs.promises.writeFile(`./static/editor/index.html`, html);
    await fs.promises.writeFile(
      `./static/editor/project.js`,
      `import {index} from '/editor/main.js';` +
        `index(${JSON.stringify(examples)});`,
    );
  },
});
