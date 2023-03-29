import type {Project} from '@motion-canvas/core';
import {Renderer} from '@motion-canvas/core';

declare global {
  interface Window {
    onRenderComplete: () => void;
  }
}

export const render = async (project: Project) => {
  try {
    const renderer = new Renderer(project);
    await renderer.render({
      ...project.meta.getFullRenderingSettings(),
      name: project.name,
    });
  } finally {
    window.onRenderComplete();
  }
};
