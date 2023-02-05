// FIXME: imports
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { Shape, ShapeProps } from '@motion-canvas/2d/lib/components';
import { SimpleSignal } from '@motion-canvas/core/lib/signals';

export interface AxesProps extends ShapeProps {
    title: string;
    xLabel?: string;
    yLabel?: string;
    limit: number[];
    ticks?: number[];
    showAxes?: boolean[];
    showAxesNumbers?: boolean[];
    axesLineWidth?: number[];
    ticksLineWidth?: number[];
    AxesLineWidth?: number[];
}

export class Axes extends Shape {
    @initial('')
    @signal()
    public declare readonly title: SimpleSignal<string, this>;

    @initial('x')
    @signal()
    public declare readonly xLabel: SimpleSignal<string, this>;

    @initial('y')
    @signal()
    public declare readonly yLabel: SimpleSignal<string, this>;

    @signal()
    public declare readonly limit: SimpleSignal<number[], this>;

    @initial([10, 10])
    @signal()
    public declare readonly ticks: SimpleSignal<number[], this>;

    @initial([true, true])
    @signal()
    public declare readonly showAxes: SimpleSignal<boolean[], this>;

    @initial([true, true])
    @signal()
    public declare readonly showAxesNumbers: SimpleSignal<boolean[], this>;

    @initial([1, 1])
    @signal()
    public declare readonly axesLineWidth: SimpleSignal<number[], this>;

    @initial([1, 1])
    @signal()
    public declare readonly ticksLineWidth: SimpleSignal<number[], this>;


    public constructor(props: AxesProps) {
        super(props);
    }

    private seperation(start: number, end: number, step: number): number {
        return (end - start) / step;
    }

    private mapInterval(value: number, a: number, b: number, c: number, d: number): number {
        // [a,b] to [c,d]
        // taken from https://github.com/processing/p5.js/blob/main/src/math/calculation.js#L448
        return ((value - a) / (b - a)) * (d - c) + c;
    }

    private invXMap(x: number): number {
        return this.mapInterval(x, -this.getWidth() / 2, this.getWidth() / 2, this.limit()[0], this.limit()[1])
    }


    private invYMap(y: number): number {
        return this.mapInterval(y, -this.getHeight() / 2, this.getHeight() / 2, this.limit()[2], this.limit()[3])
    }

    private drawXAxis(context: CanvasRenderingContext2D): void {
        const width = this.getWidth();
        context.lineWidth = this.axesLineWidth()[0];
        context.beginPath();
        context.moveTo(-width / 2, 0);
        context.lineTo(width / 2, 0);
        context.stroke();
    }
    private drawYAxis(context: CanvasRenderingContext2D): void {
        const height = this.getHeight();

        context.lineWidth = this.axesLineWidth()[1];
        context.beginPath();
        context.moveTo(0, -height / 2);
        context.lineTo(0, height / 2);
        context.stroke();
    }

    private drawTicks(context: CanvasRenderingContext2D): void {
        let [xtick, ytick] = this.ticks();
        let [showXNum, showYNum] = this.showAxesNumbers();
        let [xLineW, yLineW] = this.ticksLineWidth();

        let roundDecimal = 0; // TODO: apply scientific notation for big numbers

        // draw xticks
        context.lineWidth = xLineW;
        context.beginPath();
        let dx = this.seperation(-this.getWidth() / 2, this.getWidth() / 2, xtick);
        let tick_height = this.getWidth() / 100;
        for (let i = 0; i < xtick + 1; i++) {
            let current_x = -this.getWidth() / 2 + i * dx;

            context.moveTo(current_x, -tick_height);
            context.lineTo(current_x, tick_height);
            if (showXNum && current_x !== 0) {
                context.font = `${this.fontSize()}px ${this.fontFamily()}`;
                context.textAlign = "center";
                context.fillText(
                    this.invXMap(current_x).toFixed(roundDecimal).toString(),
                    current_x,
                    tick_height + this.fontSize()
                )
            }
        }
        context.stroke()

        // draw yticks
        context.lineWidth = yLineW;
        context.beginPath();
        let dy = this.seperation(-this.getHeight() / 2, this.getHeight() / 2, ytick);
        let tick_width = this.getHeight() / 100;

        for (let i = 0; i < ytick + 1; i++) {
            let current_y = this.getHeight() / 2 - i * dy;

            context.moveTo(-tick_width, current_y);
            context.lineTo(tick_width, current_y);
            if (showYNum && current_y !== 0) {
                context.font = `${this.fontSize()}px ${this.fontFamily()}`;
                context.textAlign = "left";
                context.fillText(
                    this.invYMap(-current_y).toFixed(roundDecimal).toString(),
                    tick_width,
                    current_y + this.fontSize() / 2,
                )
            }
        }
        context.stroke()
    }

    protected override drawShape(context: CanvasRenderingContext2D): void {
        this.applyStyle(context);
        let [showXAxis, showYAxis] = this.showAxes();
        if (showXAxis) {
            this.drawXAxis(context);
        }
        if (showYAxis) {
            this.drawYAxis(context);
        }

        this.drawTicks(context);


        // TODO: Position of the titles and labels shoulde be changed
        let titleFontSize = this.getHeight() / 20;
        context.textAlign = "center";
        context.font = `${titleFontSize}px ${this.fontFamily()}`;
        context.fillText(this.title(), 0, -this.getHeight() / 2 - titleFontSize * 2);

        context.font = `${this.fontSize()}px ${this.fontFamily()}`;
        context.fillText(this.xLabel(), this.getWidth() / 2, -this.fontSize());

        let tick_width = this.getHeight() / 100;
        context.font = `${this.fontSize()}px ${this.fontFamily()}`;
        context.fillText(this.yLabel(), -tick_width * 2, -this.getHeight() / 2);

    }

}
