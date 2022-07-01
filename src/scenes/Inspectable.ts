import {Rect, Vector2} from '../types';

/**
 * Represents an element to inspect.
 *
 * The type is not important because the UI does not interact with it.
 * It serves as a key that will be passed back to an Inspectable scene to
 * receive more information about said element.
 */
export type InspectedElement = unknown;

/**
 * Represents attributes of an inspected element.
 */
export type InspectedAttributes = Record<string, any>;

/**
 * Represents different sizes and/or coordinates of an inspected element.
 */
export interface InspectedSize {
  /**
   * Bounding box of the element (with padding).
   */
  rect?: Rect;

  /**
   * Bounding box of the content of this element (without padding).
   */
  contentRect?: Rect;

  /**
   * Bounding box of the element (with margin).
   */
  marginRect?: Rect;

  /**
   * The absolute position of the object's origin.
   */
  position?: Vector2;
}

/**
 * Scenes can implement this interface to make their components
 * inspectable through the UI.
 */
export interface Inspectable {
  /**
   * Get a possible element to inspect at a given position.
   *
   * @param x
   * @param y
   */
  inspectPosition(x: number, y: number): InspectedElement | null;

  /**
   * Validate if the inspected element is still valid.
   *
   * If a scene destroys and recreates its components upon every reset, the
   * reference may no longer be valid. Even though the component is still
   * present. This method should check that and return a new reference.
   *
   * See {@link KonvaScene.validateInspection()} for a sample implementation.
   *
   * @param element
   */
  validateInspection(element: InspectedElement | null): InspectedElement | null;

  /**
   * Return the attributes of the inspected element.
   *
   * This information will be displayed in the "Properties" panel.
   *
   * @param element
   */
  inspectAttributes(element: InspectedElement): InspectedAttributes | null;

  /**
   * Return the sizes of the inspected element.
   *
   * This information will be used to draw the bounding boxes on the screen.
   *
   * @param element
   */
  inspectBoundingBox(element: InspectedElement): InspectedSize;
}

export function isInspectable(value: any): value is Inspectable {
  return value && typeof value === 'object' && 'validateInspection' in value;
}
