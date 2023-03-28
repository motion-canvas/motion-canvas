import {mathjax} from 'mathjax-full/js/mathjax';
import {TeX} from 'mathjax-full/js/input/tex';
import {SVG} from 'mathjax-full/js/output/svg';
import {AllPackages} from 'mathjax-full/js/input/tex/AllPackages';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html';
import {computed, initial, parser, signal} from '../decorators';
import {
  Signal,
  SignalValue,
  SimpleSignal,
} from '@motion-canvas/core/lib/signals';
import {OptionList} from 'mathjax-full/js/util/Options';
import {
  SVGProps,
  SVG as SVGNode,
  ParsedSVG,
  SVGChildNode,
  RawSVGChild,
  RawSVG,
} from './SVG';
import {lazy, threadable} from '@motion-canvas/core/lib/decorators';
import {TimingFunction} from '@motion-canvas/core/lib/tweening';
import {useLogger} from '@motion-canvas/core/lib/utils';
import {Node} from './Node';

const Adaptor = liteAdaptor();
RegisterHTMLHandler(Adaptor);

const JaxDocument = mathjax.document('', {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  InputJax: new TeX({packages: AllPackages}),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  OutputJax: new SVG({fontCache: 'local'}),
});

export interface LatexProps extends SVGProps {
  tex?: SignalValue<string[] | string>;
  renderProps?: SignalValue<OptionList>;
}

export class Latex extends SVGNode {
  @lazy(() => {
    return parseFloat(
      window.getComputedStyle(SVGNode.containerElement).fontSize,
    );
  })
  private static containerFontSize: number;
  private static svgContentsPool: Record<string, string> = {};
  private static texNodesPool: Record<string, RawSVG> = {};
  private svgSubTexMap: Record<string, string[]> = {};

  @initial({})
  @signal()
  public declare readonly options: SimpleSignal<OptionList, this>;

  @initial('')
  @parser(function (this: SVGNode, value: string[] | string): string[] {
    const array = typeof value === 'string' ? [value] : value;
    const subtex = array
      .reduce<string[]>((prev, current) => {
        prev.push(...current.split(/{{(.*?)}}/));
        return prev;
      }, [])
      .map(sub => sub.trim())
      .filter(sub => sub.length > 0);
    return subtex;
  })
  @signal()
  public declare readonly tex: Signal<string[] | string, string[], this>;

  public constructor(props: LatexProps) {
    super({
      fontSize: 48,
      ...props,
    });
    this.svg(this.latexSVG);
    this.wrapper.scale(this.scaleFactor);
  }

  @computed()
  protected scaleFactor() {
    return this.fontSize() / Latex.containerFontSize;
  }

  @computed()
  protected latexSVG() {
    return this.texToSvg(this.tex());
  }

  protected subtexsToLatex(subtexs: string[]) {
    return subtexs.join('');
  }

  private getNodeCharacterId({id}: RawSVGChild) {
    if (!id.includes('-')) return id;
    return id.substring(id.lastIndexOf('-') + 1);
  }

  protected override parseSVG(svg: string): ParsedSVG {
    const subtexs = this.svgSubTexMap[svg]!;
    const key = `[${subtexs.join(',')}]::${JSON.stringify(this.options())}`;
    const cached = Latex.texNodesPool[key];
    if (cached && (cached.size.x > 0 || cached.size.y > 0))
      return this.buildParsedSVG(Latex.texNodesPool[key]);
    const oldSVG = SVGNode.parseSVGasRaw(svg);
    const oldNodes = [...oldSVG.nodes];

    const newNodes: RawSVGChild[] = [];
    for (const sub of subtexs) {
      const subsvg = this.subTexToSVG(sub);
      const subnodes = SVGNode.parseSVGasRaw(subsvg).nodes;

      const firstId = this.getNodeCharacterId(subnodes[0]);
      const spliceIndex = oldNodes.findIndex(
        node => this.getNodeCharacterId(node) === firstId,
      );
      const children = oldNodes.splice(spliceIndex, subnodes.length);

      if (children.length == 1) {
        newNodes.push({
          ...children[0],
          id: sub,
        });
        continue;
      }

      newNodes.push({
        id: sub,
        type: Node,
        props: {},
        children,
      });
    }
    if (oldNodes.length > 0)
      useLogger().error('matching between Latex SVG and subtex failed');

    const newSVG: RawSVG = {
      size: oldSVG.size,
      nodes: newNodes,
    };
    Latex.texNodesPool[key] = newSVG;
    return this.buildParsedSVG(newSVG);
  }

  protected override isNodeEqual(
    aNode: SVGChildNode,
    bNode: SVGChildNode,
  ): boolean {
    return aNode.id === bNode.id;
  }

  private texToSvg(subtexs: string[]) {
    const singleTex = subtexs.join('');
    const svg = this.singleTexToSVG(singleTex);
    this.svgSubTexMap[svg] = subtexs;
    return svg;
  }

  private subTexToSVG(subtex: string) {
    let tex = subtex.trim();
    if (
      ['\\overline', '\\sqrt', '\\sqrt{'].includes(tex) ||
      tex.endsWith('_') ||
      tex.endsWith('^') ||
      tex.endsWith('dot')
    )
      tex += '{\\quad}';

    if (tex === '\\substack') tex = '\\quad';

    const numLeft = tex.match(/\\left[()[\]|.\\]/g)?.length ?? 0;
    const numRight = tex.match(/\\right[()[\]|.\\]/g)?.length ?? 0;
    if (numLeft !== numRight) {
      tex = tex.replace(/\\left/g, '\\big').replace(/\\right/g, '\\big');
    }

    const hasArrayBegin = tex.includes('\\begin{array}');
    const hasArrayEnd = tex.includes('\\end{array}');
    if (hasArrayBegin !== hasArrayEnd) tex = '';

    return this.singleTexToSVG(tex);
  }

  private singleTexToSVG(tex: string): string {
    const src = `${tex}::${JSON.stringify(this.options())}`;
    if (Latex.svgContentsPool[src]) {
      const svg = Latex.svgContentsPool[src];
      return svg;
    }

    const svg = Adaptor.innerHTML(JaxDocument.convert(tex, this.options()));
    if (svg.includes('data-mjx-error')) {
      const errors = svg.match(/data-mjx-error="(.*?)"/);
      if (errors && errors.length > 0) {
        useLogger().error(`Invalid MathJax: ${errors[1]}`);
      }
    }
    Latex.svgContentsPool[src] = svg;
    return svg;
  }

  @threadable()
  protected *tweenTex(
    value: string[],
    time: number,
    timingFunction: TimingFunction,
  ) {
    const newSVG = this.texToSvg(value);
    yield* this.svg(newSVG, time, timingFunction);
    this.svg(this.latexSVG);
  }
}
