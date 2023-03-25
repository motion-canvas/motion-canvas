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
import {SVGProps, SVG as SVGNode, ParsedSVG, SVGChildNode} from './SVG';
import {lazy, threadable} from '@motion-canvas/core/lib/decorators';
import {TimingFunction} from '@motion-canvas/core/lib/tweening';
import {useLogger} from '@motion-canvas/core/lib/utils';
import {Node} from './Node';
import {BBox, Vector2} from '@motion-canvas/core/lib/types';
import {Layout} from './Layout';

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

  protected override parseSVG(svg: string): ParsedSVG {
    const raw = super.parseSVG(svg);
    const subtexs = this.svgSubTexMap[svg]!;

    const newNodes: SVGChildNode[] = [];
    for (const sub of subtexs) {
      const subsvg = this.singleTexToSVG(sub);
      const subnodes = super.parseSVG(subsvg).nodes;

      const children = raw.nodes
        .splice(0, subnodes.length)
        .map(child => child.shape);
      const points = children.reduce<Vector2[]>((prev, current) => {
        if (current instanceof Layout) {
          const bbox = BBox.fromSizeCentered(current.size());
          const matrix = current.localToParent();
          prev.push(...bbox.corners.map(x => x.transformAsPoint(matrix)));
        }
        return prev;
      }, []);
      const bbox = BBox.fromPoints(...points);
      children.forEach(ch => {
        ch.position(ch.position().sub(bbox.center));
      });
      const node = new Node({
        position: bbox.center,
        children,
      });
      newNodes.push({
        id: sub,
        shape: node,
      });
    }
    if (raw.nodes.length > 0)
      useLogger().warn('matching between Latex SVG and subtex failed');

    return {
      size: raw.size,
      nodes: newNodes,
    };
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
