import {javascriptLanguage} from '@codemirror/lang-javascript';
import {syntaxTree} from '@codemirror/language';
import runtime from '@site/src/components/Fiddle/runtime';

function isConstructor(obj) {
  return !!obj.prototype && !!obj.prototype.constructor.name;
}

const Options = Object.entries(runtime).map(([name, value]) => ({
  label: name,
  type:
    typeof value === 'function'
      ? isConstructor(value)
        ? 'class'
        : 'function'
      : 'variable',
}));

export function autocomplete() {
  return javascriptLanguage.data.of({
    autocomplete: context => {
      const nodeBefore = syntaxTree(context.state).resolveInner(
        context.pos,
        -1,
      );
      if (nodeBefore.name === 'String') return;

      const word = context.matchBefore(/\w*/);
      if (word.from == word.to && !context.explicit) return null;
      return {
        from: word.from,
        options: Options,
      };
    },
  });
}
