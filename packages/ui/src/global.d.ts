import { KeyBindingMap } from "./utils/keyBindingMap";

declare module '*.scss';

declare class EyeDropper {
  public open(): Promise<{sRGBHex: string}>;
}

export enum Module {
  Global = 'global',
  Timeline = 'timeline',
  Viewport = 'viewport',
  Presentation = 'presentation',
  None = 'none'
};

export declare type ModuleShortcuts<T> = Record<keyof T, UIAction>
export declare type ShortcutsByModule = Record<Module, ModuleShortcuts>;


declare class KeyCode {
  private declare modifierKey? : KeyCode;
  private declare withKey? : KeyCode;
  constructor(public code: string, public shortName?: string, public longName?: string) {
    this.shortName = shortName ?? this.code;
    this.longName = this.longName ?? this.shortName;
  }

  public with(public key: KeyCode){
    this.withKey = key;
    this.shortName = this.shortName+'+'+key.code;
    return this;
  }

  public modifier(public key: KeyCode){
    this.modifierKey = key;
    this.shortName = key.code+'+'+this.shortName;
    return this;
  }
}

declare interface ActionProps {
  name: string,
  description?: string,
  keys?: KeyCode | KeyCode[],
}
declare class Action implements ActionProps{
  public keys : KeyCode[] = [];
  constructor(public name: string, public keys?: KeyCode | KeyCode[], public description?: string, public available?: (() => Boolean)) {
    this.description = description ?? this.name;
    KeyBindingMap.bindActionToKey(this, keys);
  }
}
declare class UIAction extends Action {
  public getTooltip() {
    const actionKeys = KeyBindingMap.getActionKeys(this);
    return `${this.name} ${actionKeys.map(k => '[' + k.shortName + ']').join(' or ')}`;
 }
}

