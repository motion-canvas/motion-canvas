import {Plugin as VitePlugin} from 'vite';

/**
 * Represents a Motion Canvas project configured in the Vite plugin.
 */
export interface ProjectData {
  /**
   * The name of the project.
   */
  name: string;
  /**
   * The file name containing the project.
   */
  fileName: string;
  /**
   * The path to the project relative to the Vite configuration file.
   */
  url: string;
}

/**
 * The Motion Canvas configuration passed to each plugin.
 */
export interface PluginConfig {
  /**
   * The projects configured in the Vite plugin.
   */
  projects: ProjectData[];
  /**
   * The output path relative to the Vite configuration file.
   */
  output: string;
}

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

  /**
   * The configuration hook of the plugin.
   *
   * @remarks
   * Invoked during `configResolved` hook of Vite, contains the Motion Canvas
   * specific configuration. Returned value will be merged with the current
   * configuration.
   *
   * @param config - The configuration passed to the plugin.
   */
  config?(config: PluginConfig): Promise<Partial<PluginConfig> | void>;

  /**
   * Get custom configuration that will be passed to the runtime plugin.
   *
   * @remarks
   * The config will be passed as the first argument to the default export of
   * the runtime plugin. When provided as a string, it will be injected to the
   * code as is, letting you define non-serializable values such as functions.
   *
   * If the returned value is an object, it will be converted to a JavaScript
   * object using JSON serialization.
   *
   * @example
   * Returning an object:
   * ```ts
   * {
   *   runtimeConfig: () => ({
   *     myText: 'Hello!',
   *     myNumber: 42,
   *   })
   * }
   * ```
   * Returning a string:
   * ```ts
   * {
   *   runtimeConfig: () => `{myRegex: /\\.wav$/}`
   * }
   * ```
   */
  runtimeConfig?(): Promise<any>;
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
