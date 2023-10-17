import KeyCodes from "../../utils/KeyCodes"
import { ModuleShortcuts } from "../../global";

export default TimelineKeyBindings;
const TimelineKeyBindings : ModuleShortcuts = {
   FOCUS_PLAYAHEAD: new UIAction(
      'Focus playhead', KeyCodes.KEY_F),
}
