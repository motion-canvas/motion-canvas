import {GeneratorHelper} from '../helpers';
import {Player} from './Player';
import {Thread} from '../threading';

const STORAGE_KEY = 'threads-monitor-state';

export class ThreadsMonitor {
  private list = document.createElement('ul');

  public constructor(
    private readonly player: Player,
    private readonly root: HTMLDetailsElement,
  ) {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      this.root.open = JSON.parse(savedState);
    }

    this.player.project.threadsCallback = this.render;
    this.root.addEventListener('toggle', this.handleToggle);
    this.root.appendChild(this.list);
  }

  private handleToggle = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.root.open));
  };

  private render = (rootThread: Thread) => {
    if (!this.root.open) return;

    this.list.firstElementChild?.remove();
    const queue: [Thread, HTMLElement][] = [[rootThread, this.list]];
    while (queue.length > 0) {
      const [thread, parent] = queue.shift();
      const element = this.createRunnerElement(thread);
      parent.appendChild(element);
      for (const child of thread.children) {
        queue.push([child, element]);
      }
    }
  };

  private createRunnerElement(thread: Thread): HTMLElement {
    const element = document.createElement('ul');
    const title = document.createElement('li');
    title.innerText = GeneratorHelper.getName(thread.runner);
    element.appendChild(title);
    element.classList.toggle('cancelled', thread.canceled);

    return element;
  }
}
