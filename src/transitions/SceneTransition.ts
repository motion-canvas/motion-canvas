import {ThreadGenerator} from '../threading';
import {Scene} from '../Scene';

export interface SceneTransition {
  (next: Scene, previous?: Scene): ThreadGenerator;
}
