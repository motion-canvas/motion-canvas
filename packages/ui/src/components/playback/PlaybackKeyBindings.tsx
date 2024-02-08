import { ModuleShortcuts } from '../../contexts';
import { UIAction } from '../../Index';
import { KeyCodes } from '@motion-canvas/core';

export enum PlaybackActions {
   NEXT_SLIDE,
   PREV_SLIDE,
   TOGGLE_FULLSCREEN,
   RESUME,
   SHOW_OVERLAY,
   TOGGLE_PRESENT_MODE,
   TO_FIRST_SLIDE,
   TO_LAST_SLIDE,
}

export type PlaybackKeybindingsType = Record<keyof typeof PlaybackActions , UIAction> | ModuleShortcuts
export const PlaybackKeybindings : PlaybackKeybindingsType = {
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
 