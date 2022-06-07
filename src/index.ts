import {render} from 'preact';
import {AppNode} from './App';

const app = document.createElement('main');
document.body.appendChild(app);
render(AppNode, app);
