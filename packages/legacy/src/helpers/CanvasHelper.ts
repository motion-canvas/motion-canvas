import type {Context} from 'konva/lib/Context';
import {PossibleSpacing, Spacing} from '@motion-canvas/core/lib/types';

export const CanvasHelper = {
  roundRect<T extends CanvasRenderingContext2D | Context>(
    ctx: T,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: PossibleSpacing,
  ): T {
    ctx.beginPath();
    this.roundRectPath(ctx, x, y, width, height, radius);
    ctx.closePath();

    return ctx;
  },

  roundRectPath<T extends CanvasRenderingContext2D | Context | Path2D>(
    ctx: T,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: PossibleSpacing,
  ): T {
    const spacing = new Spacing(radius);
    const maxRadius = Math.min(height / 2, width / 2);
    spacing.left = Math.min(spacing.left, maxRadius);
    spacing.right = Math.min(spacing.right, maxRadius);
    spacing.top = Math.min(spacing.top, maxRadius);
    spacing.bottom = Math.min(spacing.bottom, maxRadius);

    ctx.moveTo(x + spacing.left, y);
    ctx.arcTo(x + width, y, x + width, y + height, spacing.top);
    ctx.arcTo(x + width, y + height, x, y + height, spacing.right);
    ctx.arcTo(x, y + height, x, y, spacing.bottom);
    ctx.arcTo(x, y, x + width, y, spacing.left);

    return ctx;
  },
};
