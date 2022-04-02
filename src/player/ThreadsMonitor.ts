import {GeneratorHelper} from '../helpers';
import {Player} from './Player';

export class ThreadsMonitor {
  public constructor(
    private readonly player: Player,
    private readonly root: HTMLElement,
  ) {
    this.player.project.threadsCallback = this.render;
  }

  private render = (
    runners: Generator[],
    children: Map<Generator, Generator[]>,
    cancelled: Set<Generator>,
  ) => {
    const elements = new Map<Generator, HTMLElement>();
    const root = document.createElement('ul');
    for (const runner of runners) {
      let element = elements.get(runner);
      if (!element) {
        element = this.createRunnerElement(runner, cancelled);
        root.appendChild(element);
        elements.set(runner, element);
      }

      for (const child of children.get(runner) ?? []) {
        let childElement = elements.get(child);
        if (!childElement) {
          childElement = this.createRunnerElement(child, cancelled);
          elements.set(child, childElement);
        }
        element.appendChild(childElement);
      }
    }

    this.root.querySelector('ul')?.remove();
    this.root.appendChild(root);
  };

  private createRunnerElement(
    runner: Generator,
    cancelled: Set<Generator>,
  ): HTMLElement {
    const element = document.createElement('ul');
    const title = document.createElement('li');
    title.innerText = GeneratorHelper.getName(runner);
    element.appendChild(title);
    element.classList.toggle('cancelled', cancelled.has(runner));

    return element;
  }
}
