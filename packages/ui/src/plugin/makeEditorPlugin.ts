import type {EditorPlugin} from './EditorPlugin';

/**
 * A helper function for exporting editor plugins.
 *
 * @param plugin - The plugin configuration.
 *
 * @example
 * ```ts
 * export default makePlugin({
 *   name: 'my-custom-plugin',
 * });
 * ```
 *
 * @experimental
 */
export function makeEditorPlugin(
  plugin: EditorPlugin | (() => EditorPlugin),
): () => EditorPlugin {
  return typeof plugin === 'function' ? plugin : () => plugin;
}
