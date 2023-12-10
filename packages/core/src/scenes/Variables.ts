import {createSignal, SimpleSignal} from '../signals';
import type {Scene} from './Scene';

export class Variables {
  private signals: {[key: string]: SimpleSignal<any>} = {};
  private variables: Record<string, unknown> = {};

  public constructor(private readonly scene: Scene) {
    scene.onReset.subscribe(this.handleReset);
  }

  /**
   * Get variable signal if exists or create signal if not
   *
   * @param name - The name of the variable.
   * @param initial - The initial value of the variable. It will be used if the
   *                  variable was not configured from the outside.
   */
  public get<T>(name: string, initial: T): () => T {
    this.signals[name] ??= createSignal(this.variables[name] ?? initial);
    return () => this.signals[name]();
  }

  /**
   * Update all signals with new project variable values.
   */
  public updateSignals(variables: Record<string, unknown>) {
    this.variables = variables;
    Object.keys(variables).map(variableName => {
      if (variableName in this.signals) {
        this.signals[variableName](variables[variableName]);
      }
    });
  }

  /**
   * Reset all stored signals.
   */
  public handleReset = () => {
    this.signals = {};
  };
}
