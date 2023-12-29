import {syntaxTree} from '@codemirror/language';
import {
  EditorState,
  RangeSet,
  RangeValue,
  StateEffect,
  StateField,
} from '@codemirror/state';
import {
  Decoration,
  DecorationSet,
  EditorView,
  Tooltip,
  hoverTooltip,
} from '@codemirror/view';

const ClearErrors = StateEffect.define();
const AddError = StateEffect.define<{
  from: number;
  to: number;
  tooltip: string;
}>({
  map: ({from, to, tooltip}, change) => ({
    from: change.mapPos(from),
    to: change.mapPos(to),
    tooltip,
  }),
});

const UnderlineMark = Decoration.mark({class: 'cm-underline'});
const UnderlineTheme = EditorView.baseTheme({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '.cm-underline': {
    textDecoration: 'var(--ifm-color-danger-dark) wavy underline',
  },
});

const UnderlineField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update: (underlines, transaction) => {
    underlines = underlines.map(transaction.changes);
    for (const effect of transaction.effects) {
      if (effect.is(ClearErrors)) {
        underlines = underlines.update({
          filter: () => false,
        });
        break;
      }
      if (effect.is(AddError)) {
        underlines = underlines.update({
          add: [UnderlineMark.range(effect.value.from, effect.value.to)],
        });
      }
    }
    return underlines;
  },
  provide: field => EditorView.decorations.from(field),
});

class TooltipRange extends RangeValue {
  public constructor(public tooltip: string) {
    super();
  }
}

const TooltipField = StateField.define<RangeSet<TooltipRange>>({
  create: () => RangeSet.empty,
  update: (tooltips, transaction) => {
    tooltips = tooltips.map(transaction.changes);
    for (const effect of transaction.effects) {
      if (effect.is(ClearErrors)) {
        tooltips = tooltips.update({
          filter: () => false,
        });
        break;
      }
      if (effect.is(AddError)) {
        tooltips = tooltips.update({
          add: [
            new TooltipRange(effect.value.tooltip).range(
              effect.value.from,
              effect.value.to,
            ),
          ],
        });
      }
    }
    return tooltips;
  },
  provide: field =>
    hoverTooltip((view, pos) => {
      let tooltip: Tooltip;
      view.state.field(field, false).between(pos, pos, (from, to, value) => {
        tooltip = {
          pos: from,
          end: to,
          create: () => {
            const dom = document.createElement('div');
            dom.textContent = value.tooltip;
            return {dom};
          },
        };
        return false;
      });
      return tooltip;
    }),
});

function getRange(state: EditorState, position: number) {
  const tree = syntaxTree(state);
  const node = tree.resolveInner(position, 1);
  return {from: node.from, to: node.to};
}

export function errorExtension() {
  return [UnderlineField, TooltipField, UnderlineTheme];
}

export function underlineErrors(
  view: EditorView,
  ranges: {from: number; to: number}[],
  error: string,
) {
  const effects: StateEffect<unknown>[] = ranges.map(range => {
    if (range.from === range.to) {
      range = getRange(view.state, range.from);
    }

    return AddError.of({tooltip: error, ...range});
  });

  view.dispatch({effects});
  return true;
}

export function clearErrors(view: EditorView) {
  view.dispatch({effects: [ClearErrors.of(null)]});
}
