import {mathjax} from 'mathjax-full/js/mathjax';
import {TeX} from 'mathjax-full/js/input/tex';
import {SVG} from 'mathjax-full/js/output/svg';
import {AllPackages} from 'mathjax-full/js/input/tex/AllPackages';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html';
import {computed, initial, signal} from '../decorators';
import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';
import {OptionList} from 'mathjax-full/js/util/Options';
import {SVGProps, SVG as SVGNode} from './SVG';
import {lazy, threadable} from '@motion-canvas/core/lib/decorators';
import {TimingFunction} from '@motion-canvas/core/lib/tweening';

const Adaptor = liteAdaptor();
RegisterHTMLHandler(Adaptor);

const JaxDocument = mathjax.document('', {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  InputJax: new TeX({packages: AllPackages}),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  OutputJax: new SVG({fontCache: 'local'}),
});

export interface LatexProps extends SVGProps {
  tex?: SignalValue<string>;
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

  @initial({})
  @signal()
  public declare readonly options: SimpleSignal<OptionList, this>;

  @signal()
  public declare readonly tex: SimpleSignal<string, this>;

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
    return this.latexToSVG(this.tex());
  }

  private latexToSVG(tex: string): string {
    const src = `${tex}::${JSON.stringify(this.options())}`;
    if (Latex.svgContentsPool[src]) return Latex.svgContentsPool[src];

    const svg = Adaptor.innerHTML(JaxDocument.convert(tex, this.options));
    Latex.svgContentsPool[src] = svg;
    return svg;
  }

  @threadable()
  protected *tweenTex(
    value: SignalValue<string>,
    time: number,
    timingFunction: TimingFunction,
  ) {
    const newValue = typeof value == 'string' ? value : value();
    const newSVG = this.latexToSVG(newValue);
    yield* this.svg(newSVG, time, timingFunction);
    this.svg(this.latexSVG);
  }
}
