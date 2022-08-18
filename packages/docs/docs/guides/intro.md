---
sidebar_position: 1
---

# Introduction

Motion Canvas is a TypeScript library and web application for creating
animations programmatically. It was invented to accelerate the process of
combining informative voice overs with supporting animation, but can satisfy a
variety of use cases. Animations are programmed in either TypeScript or
JavaScript using the Motion Canvas core library. The Motion Canvas web app then
displays a preview of the animations with an audio file of your choice.

Though most details of the animation are driven by code, your program may
selectively defer the timing of some events to be edited in the web app using a
function called `waitUntil`. From the web app, you may then drag and drop this
timing event to fine tune your animations. This is most useful for synchronizing
the timing of animations with your voice over. This way, you may program the
precise details of your animation in code, but adjust them manually to match the
imprecise timing of a recorded voice over.

Motion Canvas is not intended to be a full-sale replacement for a video editor
like Adobe Premiere Pro or DaVinci Resolve, but it may improve your workflow
when combined with these other tools.

Motion Canvas is Open Source, and relies on your feedback to inform its
development. If you would like to report a bug or request a feature, you may
visit [the GitHub repository][repo] to do so. We cannot satisfy every request,
but we do read every request, and are dedicated to making Motion Canvas work for
as wide a user base as possible.

If you would like to contribute pull requests, please read [the contribution
guide][contributing] to learn about our process.

[contributing]: https://github.com/motion-canvas/motion-canvas/blob/main/CONTRIBUTING.md
[repo]: https://github.com/motion-canvas/motion-canvas
