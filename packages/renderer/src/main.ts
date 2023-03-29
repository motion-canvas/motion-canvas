import type {Project} from '@motion-canvas/core';
import {Renderer} from '@motion-canvas/core';

export const render = async (project: Project) => {
  try {
    const renderer = new Renderer(project);
    await renderer.render({
      ...project.meta.getFullRenderingSettings(),
      name: project.name,
    });
  } finally {
    // @ts-ignore
    window.onRenderComplete();
  }
};
