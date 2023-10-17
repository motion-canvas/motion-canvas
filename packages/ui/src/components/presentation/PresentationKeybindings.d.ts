import { KeyCode, ModuleShortcuts, UIAction } from "../../global";
import KeyCodes from "../../utils/KeyCodes";

export interface PresentationActions {
   NEXT_SLIDE : UIAction,
   PREV_SLIDE : UIAction,
   TOGGLE_FULLSCREEN : UIAction,
   RESUME : UIAction,
   SHOW_OVERLAY : UIAction,
   TOGGLE_PRESENT_MODE : UIAction,
   TO_FIRST_SLIDE: string,
   TO_LAST_SLIDE: string,
}

export const PresentationKeybindings : ModuleShortcuts<PresentationActions> = {
   NEXT_SLIDE: new UIAction(
      'Next slide', [KeyCodes.UP_ARROW]
   ),
   TO_LAST_SLIDE: new UIAction(
      'To Last Slide', [KeyCodes.UP_ARROW.modifier(KeyCodes.SHIFT)]
   ),
   PREV_SLIDE: new UIAction(
      'Previous slide', [KeyCodes.DOWN_ARROW, KeyCodes.LEFT_ARROW]
   ),
   TO_FIRST_SLIDE: new UIAction(
      'To First Slide', [KeyCodes.DOWN_ARROW.modifier(KeyCodes.SHIFT)]
   ),
   TOGGLE_FULLSCREEN: new UIAction(
      'Toggle Fullscreen', [KeyCodes.KEY_F]
   ),
   RESUME: new UIAction(
      'Resume', [KeyCodes.SPACEBAR, KeyCodes.RIGHT_ARROW]
   ),
   SHOW_OVERLAY: new UIAction(
      'Show Overlay', [KeyCodes.ESCAPE, KeyCodes.KEY_Q]
   ),
   TOGGLE_PRESENT_MODE: new UIAction(
      'Toggle Presentation Mode', [KeyCodes.KEY_P]
   ),
}

