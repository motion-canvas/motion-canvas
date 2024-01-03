import {
  ColorSignal,
  PossibleColor,
  SignalValue,
  SimpleSignal,
  useLogger,
} from '@motion-canvas/core';
import {colorSignal, computed, initial, signal} from '../decorators';
import {Img, ImgProps} from './Img';

export interface IconProps extends ImgProps {
  /**
   * {@inheritDoc Icon.icon}
   */
  icon: SignalValue<string>;

  /**
   * {@inheritDoc Icon.color}
   */
  color?: SignalValue<PossibleColor>;
}

/**
 * An Icon Component that provides easy access to over 150k icons.
 * See https://icones.js.org/collection/all for all available Icons.
 */
export class Icon extends Img {
  /**
   * The identifier of the icon.
   *
   * @remarks
   * You can find identifiers on [Icônes](https://icones.js.org).
   * They can look like this:
   * * `mdi:language-typescript`
   * * `ph:anchor-simple-bold`
   * * `ph:activity-bold`
   */
  @signal()
  public declare icon: SimpleSignal<string, this>;

  /**
   * The color of the icon
   *
   * @remarks
   * Provide the color in one of the following formats:
   * * named color like `red`, `darkgray`, …
   * * hexadecimal string with # like `#bada55`, `#141414`
   *   Value can be either RGB or RGBA: `#bada55`, `#bada55aa` (latter is partially transparent)
   *   The shorthand version (e.g. `#abc` for `#aabbcc` is also possible.)
   *
   * @defaultValue 'white'
   */
  @initial('white')
  @colorSignal()
  public declare color: ColorSignal<this>;

  public constructor(props: IconProps) {
    super({
      ...props,
      src: null,
    });
  }

  /**
   * Create the URL that will be used as the Image source
   * @returns Address to Iconify API for the requested Icon.
   */
  @computed()
  protected svgUrl(): string {
    const iconPathSegment = this.icon().replace(':', '/');
    const encodedColorValue = encodeURIComponent(this.color().hex());
    // Iconify API is documented here: https://docs.iconify.design/api/svg.html#color
    return `https://api.iconify.design/${iconPathSegment}.svg?color=${encodedColorValue}`;
  }

  /**
   * overrides `Image.src` getter
   */
  protected getSrc(): string {
    return this.svgUrl();
  }

  /**
   * overrides `Image.src` setter to warn the user that the value
   * is not used
   */
  protected setSrc(src: string | null) {
    if (src === null) {
      return;
    }
    useLogger().warn(
      "The Icon Component does not accept setting the `src`. If you need access to `src`, use '<Img/>` instead.",
    );
  }
}
