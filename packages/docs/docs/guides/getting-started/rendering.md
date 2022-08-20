---
sidebar_position: 2
---

# Rendering an Animation

To render an animation, open the Rendering panel in the top left of the screen
using the button with the icon below.

![](/img/rendering_icon.svg)

You should see a panel titled "RENDERING" with several fields and a Render
button. The default settings are sufficient to render the animation, but we will
explore some of the options.

### Options

##### Range

The Range is the span of frames that will render. If set to a smaller range than
the entire length of the video, it will only render a portion of the frames in
your animation. This can be useful for quickly rendering small changes in your
animation.

##### FPS (Frames Per Second)

The frame rate at which the preview plays and the number of frames that will
render per one second of runtime. The most common values are 24, 30, and 60,
though any whole integer value is allowed. Motion Canvas animations are
resilient to changes in frame rate, so most animations will not be affected by
changing the FPS.

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

### The Output

After clicking the Render button, Motion Canvas will play through the animation
and save each frame as an image to `/output` in your project directory. From
there, you may import your animation as frames into a video editor of your
choice, or convert the frames directly to a video using a tool like `ffmpeg`.
