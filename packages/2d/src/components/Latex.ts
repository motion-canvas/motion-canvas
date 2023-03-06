import {mathjax} from 'mathjax-full/js/mathjax';
import {TeX} from 'mathjax-full/js/input/tex';
import {SVG} from 'mathjax-full/js/output/svg';
import {AllPackages} from 'mathjax-full/js/input/tex/AllPackages';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html';
import {computed, initial, signal} from '../decorators';
import {
  createComputed,
  createSignal,
  SignalValue,
  SimpleSignal,
} from '@motion-canvas/core/lib/signals';
import {OptionList} from 'mathjax-full/js/util/Options';
import {useLogger} from '@motion-canvas/core/lib/utils';
import {Shape, ShapeProps} from './Shape';
import {Rect, SerializedVector2} from '@motion-canvas/core/lib/types';
import {Length} from '../partials';
import {map, tween} from '@motion-canvas/core/lib/tweening';
import diffSequence from 'diff-sequences';

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const jaxDocument = mathjax.document('', {
  InputJax: new TeX({packages: AllPackages}),
  OutputJax: new SVG({fontCache: 'local'}),
});

interface MathJaxShapeBase {
  type: 'path' | 'rect';
  position: SerializedVector2;
}

interface MathJaxPath extends MathJaxShapeBase {
  type: 'path';
  data: string;
  name: string;
}

interface MathJaxRect extends MathJaxShapeBase {
  type: 'rect';
  size: SerializedVector2;
}

type MathJaxShape = MathJaxPath | MathJaxRect;

interface MathJaxGraphic {
  size: SerializedVector2;
  shapes: MathJaxShape[];
}

interface MathJaxShapeChanged {
  from: MathJaxShape;
  to: MathJaxShape;
}

interface MathJaxGraphicDiff {
  fromSize: SerializedVector2;
  toSize: SerializedVector2;
  inserted: MathJaxShape[];
  deleted: MathJaxShape[];
  changed: MathJaxShapeChanged[];
}

export interface LatexProps extends ShapeProps {
  tex?: SignalValue<string>;
  renderProps?: SignalValue<OptionList>;
}

export class Latex extends Shape {
  private static mathJaxCharacterWidth = createComputed(() => {
    const svg = adaptor.innerHTML(jaxDocument.convert('X'));
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

  private texProgress = createSignal<number | null>(null);
  private diffed: MathJaxGraphicDiff | null = null;

  public constructor(props: LatexProps) {
    super(props);
  }

  private *extractSVGElementShape(
    element: SVGElement,
    parentPosition: SerializedVector2,
    svgRoot: Element,
  ): Generator<MathJaxShape> {
    const {x, y} = parentPosition;
    for (const child of element.children) {
      if (!(child instanceof SVGGraphicsElement)) {
        continue;
      }
      const position: SerializedVector2 = {x, y};
      const transform = child.transform.baseVal.consolidate();
      if (transform) {
        const matrix = transform.matrix;
        if (matrix.a !== 1 || matrix.d !== 1)
          throw Error('Unknown transformation');

        position.x += matrix.e;
        position.y += matrix.f;
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
          name: child.dataset.c!,
        };
      } else if (child.tagName == 'rect') {
        position.x += parseFloat(child.getAttribute('x')!);
        position.y += parseFloat(child.getAttribute('y')!);
        yield {
          type: 'rect',
          position,
          size: {
            x: parseFloat(child.getAttribute('width')!),
            y: parseFloat(child.getAttribute('height')!),
          },
        };
      }
    }
  }

  private latexToGraphic(tex: string): MathJaxGraphic {
    const src = `${tex}::${JSON.stringify(this.options())}`;
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
      size: {
        x: viewBox.width,
        y: viewBox.height,
      },
      shapes: Array.from(
        this.extractSVGElementShape(svgElement, {x: 0, y: viewBox.y}, svgRoot),
      ),
    };
    Latex.graphicContentsPool[src] = graphic;

    return graphic;
  }

  @computed()
  private scaleFactor() {
    // From CodeBlock
    this.requestFontUpdate();
    const context = this.cacheCanvas();
    context.save();
    this.applyStyle(context);
    context.font = this.styles.font;
    const textMetric = context.measureText('X');
    const charHeight =
      textMetric.actualBoundingBoxAscent + textMetric.actualBoundingBoxDescent;
    context.restore();

    return charHeight / Latex.mathJaxCharacterWidth();
  }

  protected override desiredSize(): SerializedVector2<Length> {
    const custom = super.desiredSize();
    const scaleFactor = this.scaleFactor();
    const {x, y} = this.latexToGraphic(this.tex()).size;
    return {
      x: custom.x ?? x * scaleFactor,
      y: custom.y ?? y * scaleFactor,
    };
  }

  private drawMathShape(
    context: CanvasRenderingContext2D,
    shape: MathJaxShape,
    overridePosition: SerializedVector2 | null = null,
  ) {
    context.save();
    const {x, y} = overridePosition ? overridePosition : shape.position;
    context.translate(x, y);
    if (shape.type == 'path') {
      const p = new Path2D(shape.data);
      context.fill(p);
    } else {
      context.fillRect(0, 0, shape.size.x, shape.size.y);
    }
    context.restore();
  }

  protected override draw(context: CanvasRenderingContext2D): void {
    const rect = Rect.fromSizeCentered(this.size());

    const progress = this.texProgress();
    const scaleFactor = this.scaleFactor();

    context.translate(rect.left, rect.top);
    context.scale(scaleFactor, -scaleFactor);

    if (!progress) {
      const {shapes} = this.latexToGraphic(this.tex());

      for (const shape of shapes) {
        this.drawMathShape(context, shape);
      }
    } else {
      const diff = this.diffed!;

      for (const shape of diff.changed) {
        const position: SerializedVector2 = {
          x: map(shape.from.position.x, shape.to.position.x, progress),
          y: map(shape.from.position.y, shape.to.position.y, progress),
        };
        this.drawMathShape(context, shape.from, position);
      }

      const globalAlpha = context.globalAlpha;
      context.globalAlpha = globalAlpha * progress;
      for (const shape of diff.inserted) this.drawMathShape(context, shape);

      context.globalAlpha = globalAlpha * (1 - progress);
      for (const shape of diff.deleted) this.drawMathShape(context, shape);
    }
  }

  private isShapeEqual(aShape: MathJaxShape, bShape: MathJaxShape): boolean {
    if (aShape.type !== bShape.type) return false;
    if (
      bShape.type == 'path' &&
      aShape.type == 'path' &&
      bShape.name !== aShape.name
    )
      return false;

    return true;
  }

  private diffTex(from: string, to: string): MathJaxGraphicDiff {
    const oldGraphic = this.latexToGraphic(from);
    const newGraphic = this.latexToGraphic(to);

    const diff: MathJaxGraphicDiff = {
      fromSize: oldGraphic.size,
      toSize: newGraphic.size,
      inserted: [],
      deleted: [],
      changed: [],
    };

    const aShapes = oldGraphic.shapes;
    const bShapes = newGraphic.shapes;
    const aLength = aShapes.length;
    const bLength = bShapes.length;
    let aIndex = 0;
    let bIndex = 0;

    diffSequence(
      aLength,
      bLength,
      (aIndex, bIndex) => {
        const aShape = aShapes[aIndex];
        const bShape = bShapes[bIndex];
        return this.isShapeEqual(aShape, bShape);
      },
      (nCommon, aCommon, bCommon) => {
        if (aIndex !== aCommon)
          diff.deleted.push(...aShapes.slice(aIndex, aCommon));
        if (bIndex !== bCommon)
          diff.inserted.push(...bShapes.slice(bIndex, bCommon));

        aIndex = aCommon;
        bIndex = bCommon;
        for (let x = 0; x < nCommon; x++) {
          diff.changed.push({
            from: aShapes[aIndex],
            to: bShapes[bIndex],
          });
          aIndex++;
          bIndex++;
        }
      },
    );

    if (aIndex !== aLength) diff.deleted.push(...aShapes.slice(aIndex));

    if (bIndex !== bShapes.length) diff.inserted.push(...bShapes.slice(bIndex));

    diff.deleted = diff.deleted.filter(aShape => {
      const bIndex = diff.inserted.findIndex(bShape =>
        this.isShapeEqual(aShape, bShape),
      );
      if (bIndex >= 0) {
        const bShape = diff.inserted[bIndex];
        diff.inserted.splice(bIndex, 1);
        diff.changed.push({
          from: aShape,
          to: bShape,
        });

        return false;
      }

      return true;
    });
    return diff;
  }

  public *tweenTex(tex: string, time: number) {
    const diff = this.diffTex(this.tex(), tex);
    this.diffed = diff;

    const autoWidth = this.customWidth() == null;
    const autoHeight = this.customHeight() == null;
    const scaleFactor = this.scaleFactor();

    this.texProgress(0);
    yield* tween(
      time,
      value => {
        this.texProgress(value);

        if (autoWidth)
          this.customWidth(
            map(
              diff.fromSize.x * scaleFactor,
              diff.toSize.x * scaleFactor,
              value,
            ),
          );

        if (autoHeight)
          this.customHeight(
            map(
              diff.fromSize.y * scaleFactor,
              diff.toSize.y * scaleFactor,
              value,
            ),
          );
      },
      () => {
        this.texProgress(null);
        this.tex(tex);
        if (autoWidth) this.customWidth(null);
        if (autoHeight) this.customHeight(null);
      },
    );
  }
}
