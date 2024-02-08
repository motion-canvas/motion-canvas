import { UIAction } from '../../Index';
import { KeyCodes, } from '@motion-canvas/core';
import { ModuleShortcuts } from '../../contexts';

export enum TimelineActions {
   FOCUS_PLAYAHEAD
}

export type TimelineKeybindingsType = Record<keyof typeof TimelineActions , UIAction> | ModuleShortcuts
export const TimelineKeybindings : TimelineKeybindingsType = {
   FOCUS_PLAYAHEAD: new UIAction(
      'Focus playhead', KeyCodes.KEY_F),
}
