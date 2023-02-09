import type {Scene} from './Scene';
import {createSignal, SimpleSignal} from '../signals';

export class Variables {
  private signals: {[key: string]: SimpleSignal<any>} = {};

  public constructor(private readonly scene: Scene) {
    scene.onReset.subscribe(this.handleReset);
  }

  /**
   * Get variable signal if exists or create signal if not
   *
   * @param name - The name of the variable.
   */
  public get<T>(name: string): SimpleSignal<T> | null {
    const variables = this.scene.project.getVariables();
    if (!(name in variables)) {
      this.scene.project.logger.warn(
        `Variable ${name} has not been set in project ${this.scene.project.name}`,
      );
      return null;
    }
    if (!(name in this.signals)) {
      this.signals[name] = createSignal(variables[name]);
    }

    return this.signals[name];
  }

  /**
   * Update all signals with new project variable values.
   */
  public updateSignals = () => {
    const variables = this.scene.project.getVariables();
    Object.keys(variables).map(variableName => {
      if (variableName in this.signals) {
        this.signals[variableName](variables[variableName]);
      }
    });
  };

  /**
   * Reset all stored signals.
   */
  public handleReset = () => {
    this.signals = {};
  };
}
