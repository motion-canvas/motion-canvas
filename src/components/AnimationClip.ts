import {getset, KonvaNode} from '../decorators';
import {Sprite, SpriteData} from './Sprite';
import {GetSet} from 'konva/lib/types';
import {LinearLayout} from './LinearLayout';
import {Center} from '../types';
import {Surface, SurfaceConfig} from './Surface';
import {getStyle, Style} from '../styles';

export interface AnimationClipConfig extends SurfaceConfig {
  animation: SpriteData[];
  skin?: SpriteData;
  frame?: number;
  style?: Partial<Style>;
}

@KonvaNode()
export class AnimationClip extends Surface {
  @getset(null, AnimationClip.prototype.update)
  public animation: GetSet<AnimationClipConfig['animation'], this>;

  @getset(null, AnimationClip.prototype.update)
  public skin: GetSet<AnimationClipConfig['skin'], this>;

  @getset(0, AnimationClip.prototype.updateStyle)
  public frame: GetSet<AnimationClipConfig['frame'], this>;

  @getset(null, AnimationClip.prototype.updateStyle)
  public style: GetSet<AnimationClipConfig['style'], this>;

  public constructor(config?: AnimationClipConfig) {
    super({
      direction: Center.Horizontal,
      ...config,
    });
    this.setChild(new LinearLayout({direction: Center.Horizontal, padd: 5}));
    this.update();
  }

  private update() {
    const animation = this.animation();
    const layout = this.getChild<LinearLayout>();
    if (!animation || !layout) return;

    const skin = this.skin();
    for (let i = 0; i < animation.length; i++) {
      let sprite: Sprite;
      let surface: Surface;
      if (layout.children.length > i) {
        surface = <Surface>layout.children[i];
        sprite = surface.getChild<Sprite>();
        sprite.animation(animation);
        sprite.skin(skin);
      } else {
        surface = new Surface({
          padd: 22,
          margin: 5,
        });
        sprite = new Sprite({
          animation,
          skin,
          width: 96,
          height: 96,
        });
        surface.setChild(sprite);
        layout.add(surface);
      }
    }
    for (let i = layout.children.length - 1; i >= animation.length; i--) {
      layout.children[i].destroy();
    }
    this.updateStyle();
  }

  private updateStyle() {
    const style = getStyle(this);
    const layout = this.getChild<LinearLayout>();
    const animation = this.animation();
    if (!animation || !layout) return;

    const children = this.getChild<LinearLayout>().children;
    const frame = this.frame() % animation.length;

    this.background(style.background);

    for (let i = 0; i < children.length; i++) {
      const surface = <Surface>children[i];
      surface.background(
        frame === i ? style.backgroundLight : 'rgba(0, 0, 0, 0)',
      );
      surface.getChild<Sprite>().frame(i);
    }
  }
}
