import {HighlightStyle} from '@codemirror/language';
import {Parser, SyntaxNode, Tree} from '@lezer/common';
import {highlightTree} from '@lezer/highlight';
import {useLogger} from '@motion-canvas/core';
import {CodeHighlighter, HighlightResult} from './CodeHighlighter';
import {defaultTokenize} from './CodeTokenizer';

interface LezerCache {
  tree: Tree;
  code: string;
  colorLookup: Map<number, string>;
}

export class LezerHighlighter implements CodeHighlighter<LezerCache | null> {
  private static readonly parserMap = new Map<string, Parser>();
  private static classRegex = /\.(\S+).*color:([^;]+)/;
  private readonly classLookup = new Map<string, string>();

  public static registerParser(parser: Parser, dialect = ''): void {
    this.parserMap.set(dialect, parser);
  }

  public constructor(private readonly style: HighlightStyle) {
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

  public prepare(code: string, dialect: string): LezerCache | null {
    const parser = LezerHighlighter.parserMap.get(dialect);
    if (!parser) {
      if (dialect !== '') {
        useLogger().warn(`No parser found for dialect: ${dialect}`);
      }
      return null;
    }

    const colorLookup = new Map<number, string>();
    const tree = parser.parse(code);
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

  public tokenize(code: string, dialect: string): string[] {
    const parser = LezerHighlighter.parserMap.get(dialect);
    if (!parser) {
      if (dialect !== '') {
        useLogger().warn(`No parser found for dialect: ${dialect}`);
      }
      return defaultTokenize(code);
    }

    const tree = parser.parse(code);
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

  private getNodeId(node: SyntaxNode): number {
    if (!node.parent) {
      return -1;
    }

    // NOTE: They don't want us to know about this property.
    // We need a way to persistently identify nodes and this seems to work.
    // Perhaps it could break if the tree is edited? But we don't do that. Yet.
    return (node as any).index;
  }
}
