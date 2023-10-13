import type {Project} from '@motion-canvas/core';

export * from "../src/components/viewport/CustomStageOverlay"
import {CustomStageOverlay} from "../src/components/viewport/CustomStageOverlay"
import type {CustomStageOverlayPropsType} from "../src/components/viewport/CustomStageOverlay"
import { JSXInternal } from 'preact/src/jsx';

export function editor(project: Project): void;
export function stageOverlay(): (a?: CustomStageOverlayPropsType) => JSXInternal.Element;

export function index(
  projects: {
    name: string;
    url: string;
  }[],
): void;
