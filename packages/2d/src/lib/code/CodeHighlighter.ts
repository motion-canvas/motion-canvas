/**
 * Describes the result of a highlight operation.
 */
export interface HighlightResult {
  /**
   * The color of the code at the given index.
   */
  color: string | null;

  /**
   * The number of characters to skip ahead.
   *
   * @remarks
   * This should be used to skip to the end of the currently highlighted token.
   * The returned style will be used for the skipped characters, and they will
   * be drawn as one continuous string keeping emojis and ligatures intact.
   *
   * The returned value is the number of characters to skip ahead, not the
   * index of the end of the token.
   */
  skipAhead: number;
}

/**
 * Describes custom highlighters used by the Code node.
 *
 * @typeParam T - The type of the cache used by the highlighter.
 */
export interface CodeHighlighter<T = unknown> {
  /**
   * Initializes the highlighter.
   *
   * @remarks
   * This method is called when collecting async resources for the node.
   * It can be called multiple times so caching the initialization is
   * recommended.
   *
   * If initialization is asynchronous, a promise should be registered using
   * {@link DependencyContext.collectPromise} and the value of `false` should
   * be returned. The hook will be called again when the promise resolves.
   * This process can be repeated until the value of `true` is returned which
   * will mark the highlighter as ready.
   */
  initialize(): boolean;

  /**
   * Prepares the code for highlighting.
   *
   * @remarks
   * This method is called each time the code changes. It can be used to do
   * any preprocessing of the code before highlighting. The result of this
   * method is cached and passed to {@link highlight} when the code is
   * highlighted.
   *
   * @param code - The code to prepare.
   */
  prepare(code: string): T;

  /**
   * Highlights the code at the given index.
   *
   * @param index - The index of the code to highlight.
   * @param cache - The result of {@link prepare}.
   */
  highlight(index: number, cache: T): HighlightResult;

  /**
   * Tokenize the code.
   *
   * @param code - The code to tokenize.
   */
  tokenize(code: string): string[];
}
