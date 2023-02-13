import {mathjax} from 'mathjax-full/js/mathjax';
import {TeX} from 'mathjax-full/js/input/tex';
import {SVG} from 'mathjax-full/js/output/svg';
import {AllPackages} from 'mathjax-full/js/input/tex/AllPackages';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html';
import {initial, signal} from '../decorators';
import {
  createComputed,
  DependencyContext,
  SignalValue,
  SimpleSignal,
} from '@motion-canvas/core/lib/signals';
import {OptionList} from 'mathjax-full/js/util/Options';
import {useLogger} from '@motion-canvas/core/lib/utils';
import {Shape, ShapeProps} from './Shape';
import {Logger} from '@motion-canvas/core';
import {Rect, SerializedVector2} from '@motion-canvas/core/lib/types';
import {Length} from '../partials';

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const jaxDocument = mathjax.document('', {
  InputJax: new TeX({packages: AllPackages}),
  OutputJax: new SVG({fontCache: 'local'}),
});

interface MathJaxShapeBase {
  type: 'path' | 'rect';
  position: number[];
}

interface MathJaxPath extends MathJaxShapeBase {
  type: 'path';
  data: string;
  name: string;
}

interface MathJaxRect extends MathJaxShapeBase {
  type: 'rect';
  width: number;
  height: number;
}

type MathJaxShape = MathJaxPath | MathJaxRect;

interface MathJaxGraphic {
  width: number;
  height: number;
  shapes: MathJaxShape[];
}

export interface LatexProps extends ShapeProps {
  tex?: SignalValue<string>;
  renderProps?: SignalValue<OptionList>;
}

export class Latex extends Shape {
  private static mathJaxCharacterHeight = createComputed(() => {
    useLogger().info('Calculate x char height');
    const svg = adaptor.innerHTML(jaxDocument.convert('x'));
    const container = document.createElement('div');
    container.innerHTML = svg;
    const viewBox = container.querySelector('svg')!.viewBox;
    return viewBox.baseVal.height;
  });
  private static graphicContentsPool: Record<string, MathJaxGraphic> = {};

  @initial({})
  @signal()
  public declare readonly options: SimpleSignal<OptionList, this>;

  @signal()
  public declare readonly tex: SimpleSignal<string, this>;

  public constructor(props: LatexProps) {
    super(props);
  }

  private *extractSVGElementShape(
    element: SVGElement,
    parentPosition: number[],
    svgRoot: Element,
  ): Generator<MathJaxShape> {
    const [x, y] = parentPosition;
    for (const child of element.children) {
      if (!(child instanceof SVGGraphicsElement)) {
        continue;
      }
      const position = [x, y];
      const transform = child.transform.baseVal.consolidate();
      if (transform) {
        const matrix = transform.matrix;
        if (matrix.a !== 1 || matrix.d !== 1)
          throw Error('Unknown transformation');

        position[0] += matrix.e;
        position[1] += matrix.f;
      }
      if (child.tagName == 'g')
        yield* this.extractSVGElementShape(child, position, svgRoot);
      else if (child.tagName == 'use') {
        const hrefElement = svgRoot.querySelector(
          (child as SVGUseElement).href.baseVal,
        )!;
        yield {
          type: 'path',
          position,
          data: hrefElement.getAttribute('d')!,
          name: hrefElement.id,
        };
      } else if (child.tagName == 'rect') {
        position[0] += parseFloat(child.getAttribute('x')!);
        position[1] += parseFloat(child.getAttribute('y')!);
        yield {
          type: 'rect',
          position,
          width: parseFloat(child.getAttribute('width')!),
          height: parseFloat(child.getAttribute('height')!),
        };
      }
    }
  }

  private latexToGraphic(tex: string): MathJaxGraphic {
    const src = `${this.tex()}::${JSON.stringify(this.options())}`;
    if (Latex.graphicContentsPool[src]) return Latex.graphicContentsPool[src];

    const svgStr = adaptor.innerHTML(jaxDocument.convert(tex, this.options));

    const container = document.createElement('div');
    container.innerHTML = svgStr;

    const errorElement: SVGElement | null =
      container.querySelector('[data-mjx-error]');
    if (errorElement) {
      useLogger().error(
        `Invalid MathJax: ${errorElement.dataset['mjx-error']}`,
      );
    }

    const svgRoot = container.querySelector('svg')!;
    const viewBox = svgRoot.viewBox.baseVal;
    const svgElement = container.querySelector('g')!;

    const graphic: MathJaxGraphic = {
      width: viewBox.width,
      height: viewBox.height,
      shapes: Array.from(
        this.extractSVGElementShape(svgElement, [0, viewBox.y], svgRoot),
      ),
    };
    Latex.graphicContentsPool[src] = graphic;

    return graphic;
  }

  protected override desiredSize(): SerializedVector2<Length> {
    const custom = super.desiredSize();
    const scaleFactor = 0.05;
    const {width, height} = this.latexToGraphic(this.tex());
    useLogger().info(JSON.stringify(custom) + ' ' + width + ' ' + height);
    return {
      x: custom.x ?? width * scaleFactor,
      y: custom.y ?? height * scaleFactor,
    };
  }

  protected override draw(context: CanvasRenderingContext2D): void {
    const rect = Rect.fromSizeCentered(this.size());

    const {width, height, shapes} = this.latexToGraphic(this.tex());
    const scaleFactor = 0.05;

    context.translate(rect.left, rect.top);

    context.scale(scaleFactor, -scaleFactor);
    for (const shape of shapes) {
      context.save();
      const [x, y] = shape.position;
      context.translate(x, y);
      if (shape.type == 'path') {
        const p = new Path2D(shape.data);
        context.fill(p);
      } else {
        context.fillRect(0, 0, shape.width, shape.height);
      }
      context.restore();
    }
  }

  // protected override image(): HTMLImageElement {
  //   // Render props may change the look of the TeX, so we need to cache both
  //   // source and render props together.
  //   const src = `${this.tex()}::${JSON.stringify(this.options())}`;
  //   if (Latex.svgContentsPool[src]) {
  //     this.imageElement.src = Latex.svgContentsPool[src];
  //     return this.imageElement;
  //   }

  //   // Convert to TeX, look for any errors
  //   const tex = this.tex();
  //   const svg = adaptor.innerHTML(jaxDocument.convert(tex, this.options()));
  //   if (svg.includes('data-mjx-error')) {
  //     const errors = svg.match(/data-mjx-error="(.*?)"/);
  //     if (errors && errors.length > 0) {
  //       useLogger().error(`Invalid MathJax: ${errors[1]}`);
  //     }
  //   }

  //   // Encode to raw base64 image format
  //   const text = `data:image/svg+xml;base64,${btoa(
  //     `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n${svg}`,
  //   )}`;
  //   Latex.svgContentsPool[src] = text;
  //   const image = document.createElement('img');
  //   image.src = text;
  //   image.src = text;
  //   if (!image.complete) {
  //     DependencyContext.collectPromise(
  //       new Promise((resolve, reject) => {
  //         image.addEventListener('load', resolve);
  //         image.addEventListener('error', reject);
  //       }),
  //     );
  //   }

  //   return image;
  // }
}
