---
sidebar_position: 9
---

# Rendering

To render an animation, open the Rendering panel in the top left of the screen
using the button with the icon below.

![The icon used to identify the rendering panel tab.](/img/rendering_icon.svg)

You should see a panel titled "RENDERING" with several fields and a Render
button. The default settings are sufficient to render the animation, but we will
explore some of the options.

### Options

##### Range

The Range is the span of frames that will render. If set to a smaller range than
the entire length of the video, it will only render a portion of the frames in
your animation. This can be useful for quickly rendering small changes in your
animation.

##### Frame rate

The frame rate at which the preview plays and the number of frames that will
render per one second of runtime. The most common values are 24, 30, and 60,
though any whole integer value is allowed. Motion Canvas animations are
resilient to changes in frame rate, so most animations will not be affected by
changing it.

##### Resolution

The resolution in pixels of each frame in the video. You may use this value to
render in a higher resolution or to change the aspect ratio. Note, however, that
animations will not scale with changes in resolution, so plan ahead for any
adjustments to resolution.

##### Scale

Scale will increase or decrease the resolution of the animation, but, unlike the
Resolution option, the coordinates and size of animation elements will be
adjusted as well. You may use this option to render in multiple different
resolution densities or to adjust your output resolution after completing an
animation.

##### Color Space

The HTML Canvas color space to use when previewing or rendering the animation.
Current options include sRGB, a common color space for images and video, and
DCI-P3, a wide-gamut color space.

##### File Type

The type of image file to which Motion Canvas will convert the frames. Current
options are PNG, JPEG, and WebP. Note that Motion Canvas depends on the
capabilities of your browser to generate image files, and so WebP may not work
on Safari or older browsers.

##### Quality

The quality target for compression from 0 to 1, where a lower setting will
result in smaller file sizes but might degrade image quality. A setting of 1
will result in lossless images, such that no detail is lost, but lower settings
will often produce no discernible difference. Note that output to a file type of
PNG does not allow for different quality settings, so this option will be
ignored when outputting to PNG.

### The Output

After clicking the Render button, Motion Canvas will play through the animation
and save each frame as an image to `/output` in your project directory. The
target output direction may be configured in `vite.config.js`, however, by
setting the `output` property in the `motionCanvas` plugin options.

```js
export default defineConfig({
  plugins: [
    motionCanvas({
      output: './custom',
    }),
  ],
});
```

You may then import your animation as frames into a video editor of your choice,
or convert the frames directly to a video using a tool like `ffmpeg`.
