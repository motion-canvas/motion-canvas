import type {Project} from '@motion-canvas/core';

export function editor(project: Project): void;

export function index(
  projects: {
    name: string;
    url: string;
  }[],
): void;
