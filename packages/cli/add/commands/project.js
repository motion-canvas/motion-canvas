import prompts from 'prompts';
import path from 'path';
import fs from 'fs';
import ts from 'typescript';

import {projectTemplate} from '../templates.js';
import {createDir} from '../../utils/createDir.js';
import {createFile} from '../../utils/createFile.js';

export async function addProject() {
  const response = await prompts({
    type: 'text',
    name: 'projectName',
    message: 'Project Name',
    initial: 'myProject',
    validate: value =>
      isValidProjectName(value) ? 'Project already exists.' : true,
  });
  await createProject(response.projectName);
}

/* Is it OK to check if the project exists using this? */
function isValidProjectName(projectName) {
  return fs.existsSync(path.resolve('src', `${projectName}.ts`));
}

function isProjectArray(node) {
  if (!ts.isArrayLiteralExpression(node)) return false;
  const projectPropertyAssignment = node.parent;
  if (
    !(
      projectPropertyAssignment &&
      ts.isPropertyAssignment(projectPropertyAssignment) &&
      ts.isIdentifier(projectPropertyAssignment.name) &&
      projectPropertyAssignment.name.escapedText === 'project'
    )
  )
    return false;
  return true;
}

async function createProject(projectName) {
  await createFile(path.resolve('src', `${projectName}.ts`), projectTemplate());
  await createDir(path.resolve('src', 'scenes', projectName));

  const transformer = context => node => {
    const visitor = node => {
      if (isProjectArray(node)) {
        const newElement = ts.factory.createStringLiteral(
          `./src/${projectName}.ts`,
        );
        return ts.factory.updateArrayLiteralExpression(node, [
          ...node.elements,
          newElement,
        ]);
      }
      return ts.visitEachChild(node, child => visitor(child), context);
    };

    const rootVisitor = node => {
      node = ts.visitNode(node, visitor);
      return node;
    };

    return ts.visitNode(node, rootVisitor);
  };

  // Is this a correct way of finding the right extension?
  let language = 'ts';
  if (fs.existsSync('vite.config.js')) language = 'js';

  const src = ts.createSourceFile(
    '',
    fs.readFileSync(`vite.config.${language}`, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  const transformed = ts.transform(src, [transformer]);
  const newSrc = transformed.transformed[0];

  const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed});
  const result = printer.printNode(ts.EmitHint.Unspecified, newSrc, newSrc);

  fs.writeFile(`vite.config.${language}`, result, e => {
    if (e) console.error(e);
  });
}
