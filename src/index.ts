import type {Player} from '@motion-canvas/core/player/Player';
import {render} from 'preact';
import {App} from './App';

const konvaContainer = document.getElementById('konva');
konvaContainer.remove();
render(App(), document.body);
document.getElementById('viewport').appendChild(konvaContainer);
konvaContainer.hidden = false;
