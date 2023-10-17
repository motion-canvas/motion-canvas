import { Module, Action, KeyCode } from "../global";

export class KeyBindingMap {
   private static ActionKeys : Record<string, Record<Module , KeyCode[]>>;
   private static KeyActions : Record<string, Record<Module, Action[]>>;

   public static getKeyActions(key: KeyCode, module: Module) : Action[] {
      return KeyBindingMap.KeyActions[key.shortName][module];
   }

   public static getActionKeys(action: Action, module: Module) : KeyCode[]{
      return KeyBindingMap.ActionKeys[action.name][module];
   }

   public static bindActionToKey(action: Action, key?: KeyCode | KeyCode[]){
      let actionKeys = key ?? action.keys;
      actionKeys = Array.isArray(actionKeys) ? actionKeys : [actionKeys];
      actionKeys.forEach(k => {
         KeyBindingMap.addKeyToAction(action, k);
         KeyBindingMap.addActionToKey(k, action);
      })
   }

   public static bindKeyToAction(key: KeyCode, action: Action | Action[]){
      const actions = Array.isArray(action) ? action : [action];
      actions.forEach(a => {
         KeyBindingMap.addActionToKey(key, a)
         KeyBindingMap.addKeyToAction(a, key)
      })
   }
   
   private static addKeyToAction(action: Action, key: KeyCode, module = Module.Global){
      if(!KeyBindingMap.ActionKeys[action.name][module]){
         KeyBindingMap.ActionKeys[action.name][module] = []
      }
      KeyBindingMap.ActionKeys[action.name][module].push(key as KeyCode);
   }

   private static addActionToKey(key: KeyCode, action: Action, module = Module.Global){
      if(!KeyBindingMap.KeyActions[key.shortName][module]){
         KeyBindingMap.KeyActions[key.shortName][module] = [];
      }
      KeyBindingMap.KeyActions[key.shortName][module].push(action as Action);
   }
};