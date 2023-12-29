import {
  foldEffect,
  foldService,
  foldState,
  syntaxTree,
} from '@codemirror/language';
import {EditorState, Extension} from '@codemirror/state';
import {EditorView} from '@codemirror/view';

const FoldOffset = 'import '.length;

/**
 * Find a range that encompasses all import statements in the source code.
 *
 * @param state - The editor state.
 * @param range - An optional range to check if the imports are within.
 */
export function findImportRange(
  state: EditorState,
  range?: {from: number; to: number},
) {
  const tree = syntaxTree(state);
  let currentNode = tree.topNode.firstChild;
  let firstImport: typeof currentNode = null;
  while (currentNode) {
    if (currentNode.type.is('ImportDeclaration')) {
      firstImport = currentNode;
      break;
    }
    currentNode = currentNode.nextSibling;
  }

  if (!firstImport) {
    return null;
  }

  if (range) {
    const line = state.doc.lineAt(firstImport.from);
    if (line.from > range.to || line.to < range.from) {
      return null;
    }
  }

  let lastImport = firstImport;
  while (lastImport) {
    const nextNode = lastImport.nextSibling;
    if (!nextNode.type.is('ImportDeclaration')) {
      break;
    }
    lastImport = nextNode;
  }

  return {
    from: firstImport.from + FoldOffset,
    to: lastImport.to,
  };
}

/**
 * Create a CodeMirror extension that folds all import statements in the source
 * code.
 */
export function folding(): Extension {
  return foldService.of((state, from, to) => {
    return findImportRange(state, {from, to});
  });
}

/**
 * Fold import statements in the editor.
 *
 * @param view - The editor view.
 */
export function foldImports(view: EditorView) {
  const {state} = view;

  const range = findImportRange(state);
  if (range) {
    view.dispatch({
      effects: [foldEffect.of(range)],
    });
  }
}

/**
 * Check if the imports are folded.
 *
 * @param state - The editor state.
 */
export function areImportsFolded(state: EditorState) {
  const range = findImportRange(state);
  let folded = false;
  state.field(foldState, false).between(range.from, range.to, () => {
    folded = true;
    return false;
  });

  return folded;
}
