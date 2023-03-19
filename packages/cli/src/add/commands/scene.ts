import prompts from 'prompts';
import path from 'path';
import kleur from 'kleur';
import fs from 'fs';
import ts from 'typescript';

import {sceneTemplate} from '../templates';
import {createFile} from '../../utils/createFile';
import {getConfigFile, getLanguage} from '../../projectInfo';

export async function addScene() {
  const projectFiles = getProjectFiles();
  if (projectFiles.length == 0) throw new Error(kleur.red('No projects found'));
  const projectName = await prompts({
    type: 'select',
    name: 'projectName',
    message: 'Project Name',
    choices: projectFiles.map(file => {
      return {title: file, value: file};
    }),
  });
  const sceneName = await prompts({
    type: 'text',
    name: 'sceneName',
    message: 'Scene name',
    initial: 'myScene',
    validate: (value: string) =>
      isValidSceneName(projectName.projectName, value),
  });
  await createScene(projectName.projectName, sceneName.sceneName);
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

function getProjectFiles(): string[] {
  let projectFiles;
  const transformer: ts.TransformerFactory<ts.SourceFile> = context => node => {
    const visitor: ts.Visitor = node => {
      if (isProjectArray(node)) {
        projectFiles = node.elements.map(file =>
          file.getText().split('\\').pop()?.split('/').pop()?.slice(0, -4),
        );
        return node;
      }
      return ts.visitEachChild(node, child => visitor(child), context);
    };

    const rootVisitor: ts.Visitor = node => {
      node = ts.visitNode(node, visitor);
      return node;
    };

    return ts.visitNode(node, rootVisitor);
  };

  const src = ts.createSourceFile(
    '',
    fs.readFileSync(getConfigFile(), 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  ts.transform(src, [transformer]);

  if (projectFiles == undefined)
    throw new Error('Unable to find project files');
  return projectFiles;
}

function isValidSceneName(
  projectName: string,
  sceneName: string,
): string | boolean {
  if (
    fs.existsSync(
      path.resolve(
        'src',
        'scenes',
        `${projectName}`,
        `${sceneName}.${getLanguage()}x`,
      ),
    )
  ) {
    return 'Scene already exists';
  }
  if (!isNaN(Number(sceneName[0]))) {
    return "Scene name can't start with a number";
  }
  return true;
}

function isScenesArray(node: ts.Node): node is ts.ArrayLiteralExpression {
  return (
    ts.isArrayLiteralExpression(node) &&
    node.parent &&
    ts.isPropertyAssignment(node.parent) &&
    ts.isIdentifier(node.parent.name) &&
    node.parent.name.escapedText === 'scenes'
  );
}

function addSceneToProject(projectName: string, sceneName: string) {
  const transformer: ts.TransformerFactory<ts.SourceFile> = context => node => {
    const visitor: ts.Visitor = node => {
      if (ts.isSourceFile(node)) {
        const newElement = ts.factory.createImportDeclaration(
          undefined,
          ts.factory.createImportClause(
            false,
            ts.factory.createIdentifier(sceneName),
            undefined,
          ),
          ts.factory.createStringLiteral(
            `../scenes/${projectName}/${sceneName}?scene`,
          ),
          undefined,
        );
        const newNode = ts.factory.updateSourceFile(node, [
          node.statements[0],
          newElement,
          ...node.statements.slice(1),
        ]);
        return ts.visitEachChild(newNode, child => visitor(child), context);
      }
      if (isScenesArray(node)) {
        const newElement = ts.factory.createIdentifier(sceneName);
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
      fs.readFileSync(
        path.resolve('src', `${projectName}.${getLanguage()}`),
        'utf8',
      ),
      ts.ScriptTarget.Latest,
      true,
    );

    const transformed = ts.transform(src, [transformer]);
    const newSrc = transformed.transformed[0];

    const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed});
    const result = printer.printNode(ts.EmitHint.Unspecified, newSrc, newSrc);
    fs.writeFile(
      path.resolve('src', `${projectName}.${getLanguage()}`),
      result,
      e => {
        if (e) throw e;
      },
    );
  } catch (e) {
    throw new Error(`Unable to add scene to project file\n${e}`);
  }
}

async function createScene(projectName: string, sceneName: string) {
  try {
    await createFile(
      path.resolve(
        'src',
        'scenes',
        `${projectName}`,
        `${sceneName}.${getLanguage()}x`,
      ),
      sceneTemplate(),
    );
    addSceneToProject(projectName, sceneName);
  } catch (e) {
    throw `Unable to create scene\n${e}`;
  }
}
