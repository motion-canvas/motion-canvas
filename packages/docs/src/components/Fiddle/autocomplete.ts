import {javascriptLanguage} from '@codemirror/lang-javascript';
import {syntaxTree} from '@codemirror/language';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

function isConstructor(obj) {
  return !!obj.prototype && !!obj.prototype.constructor.name;
}

const Options: {label: string; type: string}[] = [];

function loadModule(module: Record<string, unknown>) {
  Object.entries(module).forEach(([name, value]) => {
    Options.push({
      label: name,
      type:
        typeof value === 'function'
          ? isConstructor(value)
            ? 'class'
            : 'function'
          : 'variable',
    });
  });
}

if (ExecutionEnvironment.canUseDOM) {
  import(/* webpackIgnore: true */ '@motion-canvas/core')
    .then(loadModule)
    .catch();
  import(/* webpackIgnore: true */ '@motion-canvas/2d')
    .then(loadModule)
    .catch();
}

export function autocomplete() {
  return javascriptLanguage.data.of({
    autocomplete: context => {
      const nodeBefore = syntaxTree(context.state).resolveInner(
        context.pos,
        -1,
      );
      if (nodeBefore.name === 'String') return;

      const word = context.matchBefore(/\w*/);
      if (word.from === word.to && !context.explicit) return null;
      return {
        from: word.from,
        options: Options,
      };
    },
  });
}
