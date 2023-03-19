import prompts from 'prompts';
import path from 'path';
import fs from 'fs';
import ts from 'typescript';

import {projectTemplate} from '../templates';
import {createDir} from '../../utils/createDir';
import {createFile} from '../../utils/createFile';
import {getConfigFile, getLanguage} from '../../projectInfo';

export async function addProject() {
  const response = await prompts({
    type: 'text',
    name: 'projectName',
    message: 'Project Name',
    initial: 'myProject',
    validate: (value: string) =>
      isValidProjectName(value) ? 'Project already exists.' : true,
  });
  await createProject(response.projectName);
}

function isValidProjectName(projectName: string): boolean {
  return fs.existsSync(path.resolve('src', `${projectName}.${getLanguage()}`));
}

function isProjectArray(node: ts.Node): node is ts.ArrayLiteralExpression {
  return (
    ts.isArrayLiteralExpression(node) &&
    node.parent &&
    ts.isPropertyAssignment(node.parent) &&
    ts.isIdentifier(node.parent.name) &&
    node.parent.name.escapedText === 'project'
  );
}

function addProjectToConfig(projectName: string) {
  const transformer: ts.TransformerFactory<ts.SourceFile> = context => node => {
    const visitor: ts.Visitor = node => {
      if (isProjectArray(node)) {
        const newElement = ts.factory.createStringLiteral(
          `./src/${projectName}.${getLanguage()}`,
        );
        return ts.factory.updateArrayLiteralExpression(node, [
          ...node.elements,
          newElement,
        ]);
      }
      return ts.visitEachChild(node, child => visitor(child), context);
    };

    const rootVisitor: ts.Visitor = node => {
      node = ts.visitNode(node, visitor);
      return node;
    };

    return ts.visitNode(node, rootVisitor);
  };
  try {
    const src = ts.createSourceFile(
      '',
      fs.readFileSync(getConfigFile(), 'utf8'),
      ts.ScriptTarget.Latest,
      true,
    );
    const transformed = ts.transform(src, [transformer]);
    const newSrc = transformed.transformed[0];

    const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed});
    const result = printer.printNode(ts.EmitHint.Unspecified, newSrc, newSrc);
    fs.writeFile(getConfigFile(), result, e => {
      if (e) throw e;
    });
  } catch (e) {
    throw new Error(`Unable to add project to config\n${e}`);
  }
}

async function createProject(projectName: string) {
  try {
    await createFile(
      path.resolve('src', `${projectName}.${getLanguage()}`),
      projectTemplate(),
    );
    await createDir(path.resolve('src', 'scenes', projectName));
    addProjectToConfig(projectName);
  } catch (e) {
    throw `Unable to create project\n${e}`;
  }
}
