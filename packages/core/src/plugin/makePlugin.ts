import type {Plugin} from './Plugin';

/**
 * A helper function for exporting Motion Canvas plugins.
 *
 * @param plugin - The plugin configuration.
 *
 * @example
 * ```ts
 * export default makePlugin({
 *   name: 'my-custom-plugin',
 * });
 * ```
 */
export function makePlugin(plugin: Plugin | (() => Plugin)): () => Plugin {
  return typeof plugin === 'function' ? plugin : () => plugin;
}
