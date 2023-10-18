import { ModuleShortcuts } from '../../contexts';
import { UIAction } from '../../Index';
import { KeyCodes } from '@motion-canvas/core';


export enum ViewportActions {
   ZOOM_TO_FIT,
   ZOOM_IN,
   ZOOM_OUT,
   TOGGLE_GRID,
   COPY_COORDINATES,
   USE_COLOR_PICKER,
}

export type ViewportKeybindingsType = Record<keyof typeof ViewportActions , UIAction> | ModuleShortcuts
export const ViewportKeybindings : ViewportKeybindingsType = {
   ZOOM_TO_FIT: new UIAction(
      'Zoom to fit', KeyCodes.KEY_0),
   
   ZOOM_IN: new UIAction(
      'Zoom in', KeyCodes.KEY_EQUALS),
   
   ZOOM_OUT: new UIAction(
      'Zoom Out', KeyCodes.KEY_MINUS),
   
   TOGGLE_GRID: new UIAction(
      'Toggle Grid',KeyCodes.QUOTE),
   
   COPY_COORDINATES: new UIAction(
      'Copy Coordinates', KeyCodes.KEY_P),
   
   USE_COLOR_PICKER: new UIAction(
      'Use Color Picker', KeyCodes.KEY_I, null, () => typeof EyeDropper === 'function'),
}
