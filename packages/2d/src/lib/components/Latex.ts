import {
  lazy,
  SerializedVector2,
  Signal,
  SignalValue,
  SimpleSignal,
  threadable,
  TimingFunction,
  useLogger,
  Vector2,
} from '@motion-canvas/core';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html';
import {TeX} from 'mathjax-full/js/input/tex';
import {AllPackages} from 'mathjax-full/js/input/tex/AllPackages';
import {mathjax} from 'mathjax-full/js/mathjax';
import {SVG} from 'mathjax-full/js/output/svg';
import {OptionList} from 'mathjax-full/js/util/Options';
import {computed, initial, parser, signal} from '../decorators';
import {Node} from './Node';
import {
  SVGDocument,
  SVGDocumentData,
  SVG as SVGNode,
  SVGProps,
  SVGShapeData,
} from './SVG';

const Adaptor = liteAdaptor();
RegisterHTMLHandler(Adaptor);

const JaxDocument = mathjax.document('', {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  InputJax: new TeX({packages: AllPackages}),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  OutputJax: new SVG({fontCache: 'local'}),
});

export interface LatexProps extends Omit<SVGProps, 'svg'> {
  tex?: SignalValue<string[] | string>;
  renderProps?: SignalValue<OptionList>;
}

/**
 * A node for animating equations with LaTeX.
 *
 * @preview
 * ```tsx editor
 * import {Latex, makeScene2D} from '@motion-canvas/2d';
 * import {createRef, waitFor} from '@motion-canvas/core';
 *
 * export default makeScene2D(function* (view) {
 *   const tex = createRef<Latex>();
 *   view.add(<Latex ref={tex} tex="{{y=}}{{a}}{{x^2}}" fill="white" />);
 *
 *   yield* waitFor(0.2);
 *   yield* tex().tex('{{y=}}{{a}}{{x^2}} + {{bx}}', 1);
 *   yield* waitFor(0.2);
 *   yield* tex().tex(
 *     '{{y=}}{{\\left(}}{{a}}{{x^2}} + {{bx}}{{\\over 1}}{{\\right)}}',
 *     1,
 *   );
 *   yield* waitFor(0.2);
 *   yield* tex().tex('{{y=}}{{a}}{{x^2}}', 1);
 * });
 * ```
 */
export class Latex extends SVGNode {
  @lazy(() => {
    return parseFloat(
      window.getComputedStyle(SVGNode.containerElement).fontSize,
    );
  })
  private static containerFontSize: number;
  private static svgContentsPool: Record<string, string> = {};
  private static texNodesPool: Record<string, SVGDocumentData> = {};
  private svgSubTexMap: Record<string, string[]> = {};

  @initial({})
  @signal()
  public declare readonly options: SimpleSignal<OptionList, this>;

  @initial('')
  @parser(function (this: SVGNode, value: string[] | string): string[] {
    const array = typeof value === 'string' ? [value] : value;
    return array
      .reduce<string[]>((prev, current) => {
        prev.push(...current.split(/{{(.*?)}}/));
        return prev;
      }, [])
      .filter(sub => sub.trim().length > 0);
  })
  @signal()
  public declare readonly tex: Signal<string[] | string, string[], this>;

  public constructor(props: LatexProps) {
    super({
      fontSize: 48,
      ...props,
      svg: '',
    });
    this.svg(this.latexSVG);
  }

  protected override calculateWrapperScale(
    documentSize: Vector2,
    parentSize: SerializedVector2<number | null>,
  ): Vector2 {
    if (parentSize.x || parentSize.y) {
      return super.calculateWrapperScale(documentSize, parentSize);
    }
    return new Vector2(this.fontSize() / Latex.containerFontSize);
  }

  @computed()
  protected latexSVG() {
    return this.texToSvg(this.tex());
  }

  private getNodeCharacterId({id}: SVGShapeData) {
    if (!id.includes('-')) return id;
    return id.substring(id.lastIndexOf('-') + 1);
  }

  protected override parseSVG(svg: string): SVGDocument {
    const subTexs = this.svgSubTexMap[svg]!.map(sub => sub.trim());
    const key = `[${subTexs.join(',')}]::${JSON.stringify(this.options())}`;
    const cached = Latex.texNodesPool[key];
    if (cached && (cached.size.x > 0 || cached.size.y > 0)) {
      return this.buildDocument(Latex.texNodesPool[key]);
    }
    const oldSVG = SVGNode.parseSVGData(svg);
    const oldNodes = [...oldSVG.nodes];

    const newNodes: SVGShapeData[] = [];
    for (const sub of subTexs) {
      const subSvg = this.subTexToSVG(sub);
      const subNodes = SVGNode.parseSVGData(subSvg).nodes;

      if (subNodes.length === 0) {
        continue;
      }

      const firstId = this.getNodeCharacterId(subNodes[0]);
      const spliceIndex = oldNodes.findIndex(
        node => this.getNodeCharacterId(node) === firstId,
      );
      const children = oldNodes.splice(spliceIndex, subNodes.length);

      if (children.length === 1) {
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
    if (oldNodes.length > 0) {
      useLogger().error({
        message: 'Matching between Latex SVG and tex parts failed',
        inspect: this.key,
      });
    }

    const newSVG: SVGDocumentData = {
      size: oldSVG.size,
      nodes: newNodes,
    };
    Latex.texNodesPool[key] = newSVG;
    return this.buildDocument(newSVG);
  }

  private texToSvg(subTexs: string[]) {
    const singleTex = subTexs.join('');
    const svg = this.singleTexToSVG(singleTex);
    this.svgSubTexMap[svg] = subTexs;
    return svg;
  }

  private subTexToSVG(subTex: string) {
    let tex = subTex.trim();
    if (
      ['\\overline', '\\sqrt', '\\sqrt{'].includes(tex) ||
      tex.endsWith('_') ||
      tex.endsWith('^') ||
      tex.endsWith('dot')
    ) {
      tex += '{\\quad}';
    }

    if (tex === '\\substack') tex = '\\quad';

    const numLeft = tex.match(/\\left[()[\]|.\\]/g)?.length ?? 0;
    const numRight = tex.match(/\\right[()[\]|.\\]/g)?.length ?? 0;
    if (numLeft !== numRight) {
      tex = tex.replace(/\\left/g, '\\big').replace(/\\right/g, '\\big');
    }

    const bracesLeft = tex.match(/((?<!\\)|(?<=\\\\)){/g)?.length ?? 0;
    const bracesRight = tex.match(/((?<!\\)|(?<=\\\\))}/g)?.length ?? 0;

    if (bracesLeft < bracesRight) {
      tex = '{'.repeat(bracesRight - bracesLeft) + tex;
    } else if (bracesRight < bracesLeft) {
      tex += '}'.repeat(bracesLeft - bracesRight);
    }

    const hasArrayBegin = tex.includes('\\begin{array}');
    const hasArrayEnd = tex.includes('\\end{array}');
    if (hasArrayBegin !== hasArrayEnd) tex = '';

    return this.singleTexToSVG(tex);
  }

  private singleTexToSVG(tex: string): string {
    const src = `${tex}::${JSON.stringify(this.options())}`;
    if (Latex.svgContentsPool[src]) {
      return Latex.svgContentsPool[src];
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
    const newSVG = this.texToSvg(this.tex.context.parse(value));
    yield* this.svg(newSVG, time, timingFunction);
    this.svg(this.latexSVG);
  }
}
