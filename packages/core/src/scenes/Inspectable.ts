import {Vector2} from '../types/Vector';

/**
 * Represents an element to inspect.
 *
 * @remarks
 * The type is not important because the UI does not interact with it.
 * It serves as a key that will be passed back to an Inspectable scene to
 * receive more information about said element.
 */
export type InspectedElement = unknown;

/**
 * Represents attributes of an inspected element.
 */
export type InspectedAttributes = {
  stack?: string;
  [K: string]: any;
};

/**
 * Scenes can implement this interface to make their components
 * inspectable through the UI.
 */
export interface Inspectable {
  /**
   * Get a possible element to inspect at a given position.
   *
   * @param x - The x coordinate.
   * @param y - The y coordinate.
   */
  inspectPosition(x: number, y: number): InspectedElement | null;

  /**
   * Check if the inspected element is still valid.
   *
   * @remarks
   * If a scene destroys and recreates its components upon every reset, the
   * reference may no longer be valid. Even though the component is still
   * present. This method should check that and return a new reference.
   *
   * @param element - The element to validate.
   */
  validateInspection(element: InspectedElement | null): InspectedElement | null;

  /**
   * Return the attributes of the inspected element.
   *
   * @remarks
   * This information will be displayed in the "Properties" panel.
   *
   * @param element - The element to inspect.
   */
  inspectAttributes(element: InspectedElement): InspectedAttributes | null;

  /**
   * Draw an overlay for the inspected element.
   *
   * @remarks
   * This method can be used to overlay additional information about an
   * element on top of the animation.
   *
   * @param element - The element for which to draw an overlay.
   * @param matrix - A local-to-screen matrix.
   * @param context - The context to draw with.
   */
  drawOverlay(
    element: InspectedElement,
    matrix: DOMMatrix,
    context: CanvasRenderingContext2D,
  ): void;

  /**
   * Transform the absolute mouse coordinates into the scene's coordinate system.
   *
   * @param x - The x coordinate.
   * @param y - The y coordinate.
   */
  transformMousePosition(x: number, y: number): Vector2 | null;
}

export function isInspectable(value: any): value is Inspectable {
  return value && typeof value === 'object' && 'validateInspection' in value;
}
