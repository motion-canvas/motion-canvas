// FIXME: imports
import { computed, initial, signal } from '@motion-canvas/2d/lib/decorators';
import { Shape, ShapeProps } from '@motion-canvas/2d/lib/components';
import { SimpleSignal } from '@motion-canvas/core/lib/signals';

export interface PlotProps extends ShapeProps {
    function_: Function;
    start: number;
    end: number;
    limit: number[];
    num?: number;

}

export class Plot extends Shape {

    public declare readonly function: Function;

    @signal()
    public declare readonly start: SimpleSignal<number, this>;

    @signal()
    public declare readonly end: SimpleSignal<number, this>;

    @signal()
    public declare readonly limit: SimpleSignal<number[], this>;

    @initial(50)
    @signal()
    public declare readonly num: SimpleSignal<number, this>;

    public constructor({ function_, ...rest }: PlotProps) {
        super(rest);
        this.function = function_;
    }

    private mapDif(start: number, end: number, dif: number): number {
        return (end - start) / dif;
    }

    private mapInterval(value: number, a: number, b: number, c: number, d: number): number {
        // [a,b] to [c,d]
        // taken from https://github.com/processing/p5.js/blob/main/src/math/calculation.js#L448
        return ((value - a) / (b - a)) * (d - c) + c;
    };

    private xMap(x: number): number {
        return this.mapInterval(x, this.limit()[0], this.limit()[1], -this.getWidth() / 2, this.getWidth() / 2)
    }

    private yMap(y: number): number {
        return this.mapInterval(y, this.limit()[2], this.limit()[3], -this.getHeight() / 2, this.getHeight() / 2)
    }


    @computed()
    private dx(): number {
        return this.mapDif(this.start(), this.end(), this.num());
    }

    @computed()
    public xvalues(): number[] {
        return [...Array(this.num() + 1).keys()].map(v => this.start() + v * this.dx());
    }

    @computed()
    public yvalues(): number[] {
        return this.xvalues().map(x => this.function(x));
    }

    protected override drawShape(context: CanvasRenderingContext2D): void {
        this.applyStyle(context);
        context.beginPath();
        context.moveTo(this.xMap(this.xvalues()[0]), -this.yMap(this.yvalues()[0]));

        for (let i = 1; i < this.xvalues().length; i++) {
            context.lineTo(this.xMap(this.xvalues()[i]), -this.yMap(this.yvalues()[i]));
        }
        context.stroke();
    }

}
