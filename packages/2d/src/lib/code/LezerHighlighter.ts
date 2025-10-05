import {HighlightStyle} from '@codemirror/language';
import {Parser, Tree} from '@lezer/common';
import {highlightTree} from '@lezer/highlight';
import {CodeHighlighter, HighlightResult} from './CodeHighlighter';
import {DefaultHighlightStyle} from './DefaultHighlightStyle';

interface LezerCache {
  tree: Tree;
  code: string;
  codeColors: Uint8Array;
}

export class LezerHighlighter implements CodeHighlighter<LezerCache | null> {
  private static classRegex = /\.(\S+).*color:([^;]+)/;
  private readonly classToId = new Map<string, number>();
  private readonly idToColor = new Map<number, string | null>();

  public constructor(
    private readonly parser: Parser,
    private readonly style: HighlightStyle = DefaultHighlightStyle,
  ) {
    let classCount = 1; // Keep color 0 for "unknown color"
    this.idToColor.set(0, null);
    for (const rule of this.style.module?.getRules().split('\n') ?? []) {
      const match = rule.match(LezerHighlighter.classRegex);
      if (!match) {
        continue;
      }

      const className = match[1];
      const color = match[2].trim();
      const classId = this.classToId.get(className) || false;
      if (classId !== false) {
        if (this.idToColor.get(classId) !== color) {
          throw new Error(`Conflicting color information for ${className}`);
        }
      } else {
        this.classToId.set(className, classCount);
        this.idToColor.set(classCount, color);
        classCount += 1;
      }
    }
    if (classCount > 255) {
      throw new Error('Too many classes');
    }
  }

  public initialize(): boolean {
    return true;
  }

  public prepare(code: string): LezerCache | null {
    const codeColors = new Uint8Array(code.length);
    const tree = this.parser.parse(code);
    highlightTree(tree, this.style, (from, to, classes) => {
      let color: number | false = false;
      for (const cls of classes.split(' ')) {
        const clsId = this.classToId.get(cls) || false;
        if (clsId !== false) {
          color = clsId;
        }
      }
      if (color === false) {
        return;
      }

      for (let i = from; i < to; i++) {
        codeColors[i] = color;
      }
    });

    return {
      tree,
      code,
      codeColors,
    };
  }

  public highlight(index: number, cache: LezerCache | null): HighlightResult {
    if (!cache || index > cache.codeColors.length) {
      return {
        color: null,
        skipAhead: 0,
      };
    }

    const classId = cache.codeColors[index];

    if (!this.idToColor.has(classId)) {
      throw new Error(
        `Couldn't get color for code index ${index} ${cache.codeColors.length}`,
      );
    }

    const color = this.idToColor.get(classId) || null;

    let skipAhead = 1;
    while (
      index + skipAhead < cache.codeColors.length &&
      cache.codeColors[index + skipAhead] === classId
    ) {
      skipAhead += 1;
    }

    return {
      color,
      skipAhead,
    };
  }

  public tokenize(code: string): string[] {
    const tree = this.parser.parse(code);
    const cursor = tree.cursor();
    const tokens: string[] = [];

    do {
      tokens.push(code.slice(cursor.node.from, cursor.node.to));
    } while (cursor.next());

    return tokens;
  }
}
