import {HighlightStyle} from '@codemirror/language';
import {Parser, SyntaxNode, Tree} from '@lezer/common';
import {highlightTree} from '@lezer/highlight';
import {CodeHighlighter, HighlightResult} from './CodeHighlighter';
import {DefaultHighlightStyle} from './DefaultHighlightStyle';

interface LezerCache {
  tree: Tree;
  code: string;
  colorLookup: Map<string, string>;
}

export class LezerHighlighter implements CodeHighlighter<LezerCache | null> {
  private static classRegex = /\.(\S+).*color:([^;]+)/;
  private readonly classLookup = new Map<string, string>();

  public constructor(
    private readonly parser: Parser,
    private readonly style: HighlightStyle = DefaultHighlightStyle,
  ) {
    for (const rule of this.style.module?.getRules().split('\n') ?? []) {
      const match = rule.match(LezerHighlighter.classRegex);
      if (!match) {
        continue;
      }

      const className = match[1];
      const color = match[2].trim();
      this.classLookup.set(className, color);
    }
  }

  public initialize(): boolean {
    return true;
  }

  public prepare(code: string): LezerCache | null {
    const colorLookup = new Map<string, string>();
    const tree = this.parser.parse(code);
    highlightTree(tree, this.style, (from, to, classes) => {
      const color = this.classLookup.get(classes);
      if (!color) {
        return;
      }

      const cursor = tree.cursorAt(from, 1);
      do {
        const id = this.getNodeId(cursor.node);
        colorLookup.set(id, color);
      } while (cursor.next() && cursor.to <= to);
    });

    return {
      tree,
      code,
      colorLookup,
    };
  }

  public highlight(index: number, cache: LezerCache | null): HighlightResult {
    if (!cache) {
      return {
        color: null,
        skipAhead: 0,
      };
    }

    const node = cache.tree.resolveInner(index, 1);
    const id = this.getNodeId(node);
    const color = cache.colorLookup.get(id);
    if (color) {
      return {
        color,
        skipAhead: node.to - index,
      };
    }

    let skipAhead = 0;
    if (!node.firstChild) {
      skipAhead = node.to - index;
    }

    return {
      color: null,
      skipAhead,
    };
  }

  public tokenize(code: string): string[] {
    const tree = this.parser.parse(code);
    const cursor = tree.cursor();
    const tokens: string[] = [];
    let current = 0;

    do {
      if (!cursor.node.firstChild) {
        if (cursor.from > current) {
          tokens.push(code.slice(current, cursor.from));
        }
        if (cursor.from < cursor.to) {
          tokens.push(code.slice(cursor.from, cursor.to));
        }
        current = cursor.to;
      }
    } while (cursor.next());

    return tokens;
  }

  private getNodeId(node: SyntaxNode): string {
    return `${node.from}:${node.to}`;
  }
}
