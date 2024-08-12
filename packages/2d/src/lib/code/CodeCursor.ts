import {
  clampRemap,
  Color,
  map,
  SerializedVector2,
  unwrap,
  Vector2,
} from '@motion-canvas/core';
import {Code} from '../components';
import {CodeFragment, parseCodeFragment} from './CodeFragment';
import {CodeHighlighter} from './CodeHighlighter';
import {CodeMetrics} from './CodeMetrics';
import {CodePoint, CodeRange} from './CodeRange';
import {CodeScope, isCodeScope} from './CodeScope';
import {isPointInCodeSelection} from './CodeSelection';

export interface CodeFragmentDrawingInfo {
  text: string;
  position: Vector2;
  characterSize: Vector2;
  cursor: Vector2;
  fill: string;
  time: number;
  alpha: number;
}

/**
 * A stateful class for recursively traversing a code scope.
 *
 * @internal
 */
export class CodeCursor {
  public cursor = new Vector2();
  public beforeCursor = new Vector2();
  public afterCursor = new Vector2();
  public beforeIndex = 0;
  public afterIndex = 0;
  private context = {} as CanvasRenderingContext2D;
  private monoWidth = 0;
  private maxWidth = 0;
  private lineHeight = 0;
  private fallbackFill = new Color('white');
  private caches: {before: unknown; after: unknown} | null = null;
  private highlighter: CodeHighlighter | null = null;
  private selection: CodeRange[] = [];
  private selectionProgress: number | null = null;
  private globalProgress: number[] = [];
  private fragmentDrawingInfo: CodeFragmentDrawingInfo[] = [];
  private fontHeight = 0;
  private verticalOffset = 0;

  public constructor(private readonly node: Code) {}

  /**
   * Prepare the cursor for the next traversal.
   *
   * @param context - The context used to measure and draw the code.
   */
  public setupMeasure(context: CanvasRenderingContext2D) {
    const metrics = context.measureText('X');
    this.monoWidth = metrics.width;
    this.fontHeight =
      metrics.fontBoundingBoxDescent + metrics.fontBoundingBoxAscent;
    this.verticalOffset = metrics.fontBoundingBoxAscent;
    this.context = context;
    this.lineHeight = parseFloat(this.node.styles.lineHeight);
    this.cursor = new Vector2();
    this.beforeCursor = new Vector2();
    this.afterCursor = new Vector2();
    this.beforeIndex = 0;
    this.afterIndex = 0;
    this.maxWidth = 0;
  }

  public setupDraw(context: CanvasRenderingContext2D) {
    this.setupMeasure(context);
    const fill = this.node.fill();
    this.fallbackFill =
      fill instanceof Color ? (fill as Color) : new Color('white');
    this.caches = this.node.highlighterCache();
    this.highlighter = this.node.highlighter();
    this.selection = this.node.selection();
    this.selectionProgress = this.node.selectionProgress();
    this.fragmentDrawingInfo = [];
    this.globalProgress = [];
  }

  /**
   * Measure the desired size of the code scope.
   *
   * @remarks
   * The result can be retrieved with {@link getSize}.
   *
   * @param scope - The code scope to measure.
   */
  public measureSize(scope: CodeScope) {
    const progress = unwrap(scope.progress);
    for (const wrapped of scope.fragments) {
      const possibleFragment = unwrap(wrapped);
      if (isCodeScope(possibleFragment)) {
        this.measureSize(possibleFragment);
        continue;
      }
      if (Array.isArray(possibleFragment)) {
        this.measureSize({
          progress: scope.progress,
          fragments: possibleFragment,
        });
        continue;
      }

      const fragment = parseCodeFragment(
        possibleFragment,
        this.context,
        this.monoWidth,
      );

      const beforeMaxWidth = this.calculateMaxWidth(fragment.before);
      const afterMaxWidth = this.calculateMaxWidth(fragment.after);

      const maxWidth = map(beforeMaxWidth, afterMaxWidth, progress);
      if (maxWidth > this.maxWidth) {
        this.maxWidth = maxWidth;
      }

      const beforeEnd = this.calculateWidth(fragment.before);
      const afterEnd = this.calculateWidth(fragment.after);
      this.cursor.x = map(beforeEnd, afterEnd, progress);

      if (this.cursor.y === 0) {
        this.cursor.y = 1;
      }

      this.cursor.y += map(
        fragment.before.newRows,
        fragment.after.newRows,
        progress,
      );
    }
  }

  /**
   * Get the size measured by the cursor.
   */
  public getSize() {
    return {
      x: this.maxWidth * this.monoWidth,
      y: this.cursor.y * this.lineHeight + this.verticalOffset,
    };
  }

  /**
   * Get the drawing information created by the cursor.
   */
  public getDrawingInfo() {
    return {
      fragments: this.fragmentDrawingInfo,
      verticalOffset: this.verticalOffset,
      fontHeight: this.fontHeight,
    };
  }

  /**
   * Draw the given code scope.
   *
   * @param scope - The code scope to draw.
   */
  public drawScope(scope: CodeScope) {
    const progress = unwrap(scope.progress);
    for (const wrappedFragment of scope.fragments) {
      const possibleFragment = unwrap(wrappedFragment);
      if (isCodeScope(possibleFragment)) {
        this.drawScope(possibleFragment);
        continue;
      }
      if (Array.isArray(possibleFragment)) {
        this.drawScope({
          progress: scope.progress,
          fragments: possibleFragment,
        });
        continue;
      }

      const fragment = parseCodeFragment(
        possibleFragment,
        this.context,
        this.monoWidth,
      );
      const timingOffset = 0.8;
      let alpha = 1;
      let offsetY = 0;
      if (fragment.before.content !== fragment.after.content) {
        const mirrored = Math.abs(progress - 0.5) * 2;
        alpha = clampRemap(1, 1 - timingOffset, 1, 0, mirrored);

        const isBigger =
          fragment.after.newRows > fragment.before.newRows ? 1 : -1;
        const isBefore = progress < 0.5 ? 1 : -1;
        const scale = isBigger * isBefore * 4;
        offsetY = map(
          Math.abs(fragment.after.newRows - fragment.before.newRows) / scale,
          0,
          mirrored,
        );
      }

      this.drawToken(fragment, scope, this.cursor.addY(offsetY), alpha);

      this.beforeCursor.x = this.calculateWidth(
        fragment.before,
        this.beforeCursor.x,
      );
      this.afterCursor.x = this.calculateWidth(
        fragment.after,
        this.afterCursor.x,
      );
      this.beforeCursor.y += fragment.before.newRows;
      this.afterCursor.y += fragment.after.newRows;

      this.beforeIndex += fragment.before.content.length;
      this.afterIndex += fragment.after.content.length;

      this.cursor.y += map(
        fragment.before.newRows,
        fragment.after.newRows,
        progress,
      );

      const beforeEnd = this.calculateWidth(fragment.before);
      const afterEnd = this.calculateWidth(fragment.after);
      this.cursor.x = map(beforeEnd, afterEnd, progress);
    }
  }

  private drawToken(
    fragment: CodeFragment,
    scope: CodeScope,
    offset: SerializedVector2,
    alpha: number,
  ) {
    const progress = unwrap(scope.progress);
    const currentProgress = this.currentProgress();
    if (progress > 0) {
      this.globalProgress.push(progress);
    }

    const code = progress < 0.5 ? fragment.before : fragment.after;

    let hasOffset = true;
    let width = 0;
    let stringLength = 0;
    let y = 0;
    for (let i = 0; i < code.content.length; i++) {
      let color = this.fallbackFill.serialize();
      let char = code.content.charAt(i);
      const selection: {before: number | null; after: number | null} = {
        before: null,
        after: null,
      };

      if (char === '\n') {
        y++;
        hasOffset = false;
        width = 0;
        stringLength = 0;
        selection.before = null;
        selection.after = null;
        continue;
      }

      const beforeHighlight =
        this.caches &&
        this.highlighter?.highlight(this.beforeIndex + i, this.caches.before);
      const afterHighlight =
        this.caches &&
        this.highlighter?.highlight(this.afterIndex + i, this.caches.after);

      const highlight = progress < 0.5 ? beforeHighlight : afterHighlight;
      if (highlight) {
        // Handle edge cases where the highlight style changes despite the
        // content being the same. The code doesn't fade in and out so the color
        // has to be interpolated to avoid jarring changes.
        if (
          fragment.before.content === fragment.after.content &&
          beforeHighlight?.color !== afterHighlight?.color
        ) {
          highlight.color = Color.lerp(
            beforeHighlight?.color ?? this.fallbackFill,
            afterHighlight?.color ?? this.fallbackFill,
            progress,
          ).serialize();
        }

        if (highlight.color) {
          color = highlight.color;
        }

        let skipAhead = 0;
        do {
          if (
            this.processSelection(
              selection,
              skipAhead,
              hasOffset,
              stringLength,
              y,
            )
          ) {
            break;
          }

          skipAhead++;
        } while (
          skipAhead < highlight.skipAhead &&
          code.content.charAt(i + skipAhead) !== '\n'
        );

        if (skipAhead > 1) {
          char = code.content.slice(i, i + skipAhead);
        }

        i += char.length - 1;
      } else {
        this.processSelection(selection, 0, hasOffset, stringLength, y);
        let skipAhead = 1;
        while (
          i < code.content.length - 1 &&
          code.content.charAt(i + 1) !== '\n'
        ) {
          if (
            this.processSelection(
              selection,
              skipAhead,
              hasOffset,
              stringLength,
              y,
            )
          ) {
            break;
          }

          skipAhead++;
          char += code.content.charAt(++i);
        }
      }

      let time: number;
      const selectionAfter = selection.after ?? 0;
      const selectionBefore = selection.before ?? 0;
      if (fragment.before.content === '') {
        time = selectionAfter;
      } else if (fragment.after.content === '') {
        time = selectionBefore;
      } else {
        time = map(
          selectionBefore,
          selectionAfter,
          this.selectionProgress ?? currentProgress,
        );
      }

      const measure = this.context.measureText(char);
      this.fragmentDrawingInfo.push({
        text: char,
        position: new Vector2(
          (hasOffset ? offset.x + width : width) * this.monoWidth,
          (offset.y + y) * this.lineHeight,
        ),
        cursor: new Vector2(
          hasOffset ? this.beforeCursor.x + stringLength : stringLength,
          this.beforeCursor.y + y,
        ),
        alpha,
        characterSize: new Vector2(
          measure.width / char.length,
          this.fontHeight,
        ),
        fill: color,
        time,
      });

      stringLength += char.length;
      width += Math.round(measure.width / this.monoWidth);
    }
  }

  private calculateWidth(metrics: CodeMetrics, x = this.cursor.x): number {
    return metrics.newRows === 0 ? x + metrics.lastWidth : metrics.lastWidth;
  }

  private calculateMaxWidth(metrics: CodeMetrics, x = this.cursor.x): number {
    return Math.max(this.maxWidth, metrics.maxWidth, x + metrics.firstWidth);
  }

  private currentProgress() {
    if (this.globalProgress.length === 0) {
      return 0;
    }

    let sum = 0;
    for (const progress of this.globalProgress) {
      sum += progress;
    }

    return sum / this.globalProgress.length;
  }

  private processSelection(
    selection: {before: number | null; after: number | null},
    skipAhead: number,
    hasOffset: boolean,
    stringLength: number,
    y: number,
  ): boolean {
    let shouldBreak = false;
    let currentSelected = this.isSelected(
      (hasOffset ? this.beforeCursor.x + stringLength : stringLength) +
        skipAhead,
      this.beforeCursor.y + y,
    );
    if (selection.before !== null && selection.before !== currentSelected) {
      shouldBreak = true;
    } else {
      selection.before = currentSelected;
    }

    currentSelected = this.isSelected(
      (hasOffset ? this.afterCursor.x + stringLength : stringLength) +
        skipAhead,
      this.afterCursor.y + y,
      true,
    );
    if (selection.after !== null && selection.after !== currentSelected) {
      shouldBreak = true;
    } else {
      selection.after = currentSelected;
    }

    return shouldBreak;
  }

  private isSelected(x: number, y: number, isAfter?: boolean): number {
    const point: CodePoint = [y, x];
    const maxSelection = isPointInCodeSelection(point, this.selection) ? 1 : 0;
    if (this.node.oldSelection === null || this.selectionProgress === null) {
      return maxSelection;
    }

    if (isAfter) {
      return maxSelection;
    }

    return isPointInCodeSelection(point, this.node.oldSelection) ? 1 : 0;
  }
}
