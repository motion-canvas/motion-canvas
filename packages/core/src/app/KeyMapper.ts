import { ModuleType } from "../types";
import {Modules} from "../types/Module";

export class KeyCode {
   private declare modifierKey? : KeyCode;
   private declare withKey? : KeyCode;
   public shortName : string;
   public longName : string;
   public code : string;
   constructor(code: string, shortName?: string, longName?: string) {
      this.code = code;
      this.shortName = shortName ?? this.code;
      this.longName = longName ?? this.shortName;
   }
 
   public with(key: KeyCode){
     this.withKey = key;
     this.shortName = this.shortName+'+'+key.code;
     return this;
   }
 
   public modifier(key: KeyCode){
     this.modifierKey = key;
     this.shortName = key.code+'+'+this.shortName;
     return this;
   }
 }


 export interface ActionProps {
   name: string,
   description?: string,
   keys?: KeyCode[],
 }
 export class Action implements ActionProps{
   public keys : KeyCode[] = [];
   public name = "";
   public description = "";
   public available = (() => true);
   constructor(name: string, keys: KeyCode | KeyCode[], description?: string, available = (() => true)) {
      this.name = name;
      this.description = description ?? this.name;
      this.keys = Array.isArray(keys) ? keys : [keys];
      this.available = available;
   }
 }
 

export class KeyBindingMapping {
   private static ActionKeys : Record<string, Record<ModuleType, KeyCode[]>> = {};
   private static KeyActions : Record<string, Record<ModuleType, Action[]>> = {};

   private static getModulesRecord<T>(){
      return Object.keys(Modules).reduce((res, key) =>
         (res[key as ModuleType] = [], res), {} as Record<ModuleType, T[]>)
   }

   public static getKeyActions(key: KeyCode, ModuleType: ModuleType) : Action[] {
      return KeyBindingMapping.KeyActions[key.shortName][ModuleType];
   }

   public static getActionKeys(action: Action, ModuleType: ModuleType) : KeyCode[]{
      return KeyBindingMapping.ActionKeys[action.name][ModuleType];
   }

   public static bindActionToKey(action: Action, key?: KeyCode | KeyCode[]){
      let actionKeys = key ?? action.keys;
      actionKeys = Array.isArray(actionKeys) ? actionKeys : [actionKeys];
      actionKeys.forEach(k => {
         KeyBindingMapping.addKeyToAction(action, k);
         KeyBindingMapping.addActionToKey(k, action);
      })
   }

   public static bindKeyToAction(key: KeyCode, action: Action | Action[]){
      const actions = Array.isArray(action) ? action : [action];
      actions.forEach(a => {
         KeyBindingMapping.addActionToKey(key, a)
         KeyBindingMapping.addKeyToAction(a, key)
      })
   }
   
   private static addKeyToAction(action: Action, key: KeyCode, module = (Modules.Global as ModuleType)){
      if(!KeyBindingMapping.ActionKeys[action.name]){
            KeyBindingMapping.ActionKeys[action.name] = KeyBindingMapping.getModulesRecord();
      }
      if(!KeyBindingMapping.ActionKeys[action.name][module]){
         KeyBindingMapping.ActionKeys[action.name][module] = []
      }
      KeyBindingMapping.ActionKeys[action.name][module].push(key as KeyCode);
   }

   private static addActionToKey(key: KeyCode, action: Action, module = (Modules.Global as ModuleType)){
      if(!KeyBindingMapping.KeyActions[key.shortName]){
            KeyBindingMapping.KeyActions[key.shortName] = KeyBindingMapping.getModulesRecord();
      }
      if(!KeyBindingMapping.KeyActions[key.shortName][module]){
         KeyBindingMapping.KeyActions[key.shortName][module] = [];
      }
      KeyBindingMapping.KeyActions[key.shortName][module].push(action as Action);
   }
};


export const KeyCodes = {
   SPACEBAR: new KeyCode(' ', 'Space'),
   ESCAPE: new KeyCode('Escape', 'ESC'),
   SHIFT: new KeyCode('Shift', 'Shift'),

   UP_ARROW: new KeyCode('ArrowUp', '↑', 'Up Arrow'),
   DOWN_ARROW: new KeyCode('ArrowDown', '↓', 'Down Arrow'),
   RIGHT_ARROW: new KeyCode('ArrowRight', '->', 'Right Arrow'),
   LEFT_ARROW: new KeyCode('ArrowLeft', '<-', 'Left Arrow'),

   QUOTE: new KeyCode("'", 'Quote'),

   KEY_EQUALS: new KeyCode('=', '=', 'Equals'),
   KEY_PLUS: new KeyCode('+', '+', 'Plus'),
   KEY_MINUS: new KeyCode('-', '-', 'Minus'),

   KEY_0: new KeyCode('0', '0'),
   KEY_1: new KeyCode('1', '1'),
   KEY_2: new KeyCode('2', '2'),
   KEY_3: new KeyCode('3', '3'),
   KEY_4: new KeyCode('4', '4'),
   KEY_5: new KeyCode('5', '5'),
   KEY_6: new KeyCode('6', '6'),
   KEY_7: new KeyCode('7', '7'),
   KEY_8: new KeyCode('8', '8'),
   KEY_9: new KeyCode('9', '9'),

   KEY_A: new KeyCode('a', 'A'),
   KEY_B: new KeyCode('b', 'B'),
   KEY_C: new KeyCode('c', 'C'),
   KEY_D: new KeyCode('d', 'D'),
   KEY_E: new KeyCode('e', 'E'),
   KEY_F: new KeyCode('f', 'F'),
   KEY_G: new KeyCode('g', 'G'),
   KEY_H: new KeyCode('h', 'H'),
   KEY_I: new KeyCode('i', 'I'),
   KEY_J: new KeyCode('j', 'J'),
   KEY_K: new KeyCode('k', 'K'),
   KEY_L: new KeyCode('l', 'L'),
   KEY_M: new KeyCode('m', 'M'),
   KEY_N: new KeyCode('n', 'N'),
   KEY_O: new KeyCode('o', 'O'),
   KEY_P: new KeyCode('p', 'P'),
   KEY_Q: new KeyCode('q', 'Q'),
   KEY_R: new KeyCode('r', 'R'),
   KEY_S: new KeyCode('s', 'S'),
   KEY_T: new KeyCode('t', 'T'),
   KEY_U: new KeyCode('u', 'U'),
   KEY_V: new KeyCode('v', 'V'),
   KEY_W: new KeyCode('w', 'W'),
   KEY_X: new KeyCode('x', 'X'),
   KEY_Y: new KeyCode('y', 'Y'),
   KEY_Z: new KeyCode('z', 'Z'),
}
