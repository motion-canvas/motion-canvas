import {Plugin as VitePlugin} from 'vite';

export const PLUGIN_OPTIONS = Symbol.for(
  '@motion-canvas/vite-plugin/PLUGIN_OPTIONS',
);

export interface PluginOptions {
  /**
   * An entry point of the runtime plugin.
   *
   * @remarks
   * While the Vite plugin can extend the backend functionality, this entry
   * point lets you include custom runtime code that will be loaded by the
   * browser.
   *
   * It should be a valid module specifier from which the plugin will be
   * imported. The module should contain a default export of a runtime plugin.
   */
  entryPoint: string;
}

/**
 * Represents a Motion Canvas plugin.
 *
 * @remarks
 * It's a normal Vite plugin that can provide additional configuration specific
 * to Motion Canvas.
 */
export type Plugin = VitePlugin & {
  /**
   * The configuration specific to Motion Canvas.
   */
  [PLUGIN_OPTIONS]: PluginOptions;
};

export function isPlugin(value: any): value is Plugin {
  return value && typeof value === 'object' && PLUGIN_OPTIONS in value;
}
