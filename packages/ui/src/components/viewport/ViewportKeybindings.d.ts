import KeyCodes from "../../utils/KeyCodes"
import { ModuleShortcuts } from "../../global";

export default ViewportKeyBindings;
const ViewportKeyBindings : ModuleShortcut = {
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
