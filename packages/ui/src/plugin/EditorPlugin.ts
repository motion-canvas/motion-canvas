import {Plugin} from '@motion-canvas/core';
import {FunctionComponent} from 'preact';

/**
 * Properties passed to the {@link PluginTabConfig.tabComponent} and
 * {@link PluginTabConfig.paneComponent} by the editor.
 */
export interface PluginTabProps {
  /**
   * A unique identifier of the tab.
   *
   * @remarks
   * Generated by the editor based on the tab and plugin names. Should be passed
   * to the {@link Tab} component generated by the
   * {@link PluginTabConfig.tabComponent} to make the corresponding pane appear
   * when the tab is selected.
   */
  tab: string;
}

/**
 * Configuration for a custom tab in the editor.
 */
export interface PluginTabConfig {
  /**
   * The name of this tab.
   *
   * @remarks
   * Used as a unique identifier within the scope of the plugin.
   */
  name: string;
  /**
   * The tab visible in the navigation bar on the left of the editor.
   */
  tabComponent: FunctionComponent<PluginTabProps>;
  /**
   * The pane displayed in the sidebar when the tab is selected.
   */
  paneComponent: FunctionComponent<PluginTabProps>;
}

/**
 * Configuration for a custom inspector in the editor.
 */
export interface PluginInspectorConfig {
  /**
   * A unique key representing the payload this inspector can handle.
   *
   * @remarks
   * This key will be matched against {@link Inspection.key} to determine if the
   * inspector should be displayed.
   */
  key: string;

  /**
   * The component displayed in the inspector.
   */
  component: FunctionComponent;
}

export interface PluginDrawFunction {
  (ctx: CanvasRenderingContext2D, matrix: DOMMatrix): void;
}

/**
 * Configuration for a custom overlay in the editor.
 */
export interface PluginOverlayConfig {
  /**
   * A hook returning a function used to draw on the overlay canvas.
   *
   * @remarks
   * This hook will be invoked at the top level of the overlay component. It can
   * use any Preact hooks and should return a {@link PluginDrawFunction} that
   * takes the context and uses it to draw the overlay. Reference comparison is
   * used to determine if the overlay should be redrawn.
   */
  drawHook?: () => PluginDrawFunction;
  /**
   * The component displayed on top of the canvas.
   *
   * @remarks
   * Can be used to display additional controls or information using HTML.
   * Usually implemented using {@link OverlayWrapper}.
   */
  component?: FunctionComponent;
}

/**
 * Represents an editor plugin.
 *
 * @remarks
 * Passed to {@link makeEditorPlugin} to create a plugin.
 *
 * @experimental
 */
export interface EditorPlugin extends Plugin {
  /**
   * Configuration for custom tabs displayed in the sidebar.
   */
  tabs?: PluginTabConfig[];
  /**
   * Top-level component that will wrap the entire editor.
   *
   * @remarks
   * Can be used for setting up global contexts.
   */
  provider?: FunctionComponent;
  /**
   * Configuration for custom overlays displayed on top of the preview.
   */
  previewOverlay?: PluginOverlayConfig;
  /**
   * Configuration for custom overlays displayed on top of the presentation.
   */
  presenterOverlay?: PluginOverlayConfig;
  /**
   * Configuration for custom inspectors displayed on the right.
   */
  inspectors?: PluginInspectorConfig[];
}
