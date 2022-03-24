import {Context} from 'konva/lib/Context';
import {PossibleSpacing, Spacing} from "MC/types";

export namespace CanvasHelper {
  export function roundRect<T extends CanvasRenderingContext2D | Context>(
    ctx: T,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: PossibleSpacing,
  ): T {
    ctx.beginPath();
    roundRectPath(ctx, x, y, width, height, radius);
    ctx.closePath();

    return ctx;
  }

  export function roundRectPath<
    T extends CanvasRenderingContext2D | Context | Path2D,
  >(
    ctx: T,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: PossibleSpacing,
  ): T {
    //FIXME Handle too small radii
    const spacing = new Spacing(radius);
    ctx.moveTo(x + spacing.left, y);
    ctx.arcTo(x + width, y, x + width, y + height, spacing.top);
    ctx.arcTo(x + width, y + height, x, y + height, spacing.right);
    ctx.arcTo(x, y + height, x, y, spacing.bottom);
    ctx.arcTo(x, y, x + width, y, spacing.left);

    return ctx;
  }
}
