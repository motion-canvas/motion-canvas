# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0-alpha.1](https://github.com/motion-canvas/motion-canvas/compare/v2.6.0...v3.0.0-alpha.1) (2023-02-27)


### Bug Fixes

* **2d:** fix performance issue with audio track ([#427](https://github.com/motion-canvas/motion-canvas/issues/427)) ([c993770](https://github.com/motion-canvas/motion-canvas/commit/c993770937ddfdf0ac39b144a1f79f1a300f7899))
* **ui:** correctly reset zoom ([#432](https://github.com/motion-canvas/motion-canvas/issues/432)) ([a33ee14](https://github.com/motion-canvas/motion-canvas/commit/a33ee14dfac3e1fe24c89d76631e23fe4cb625a6))


### Features

* new playback architecture ([#402](https://github.com/motion-canvas/motion-canvas/issues/402)) ([bbe3e2a](https://github.com/motion-canvas/motion-canvas/commit/bbe3e2a24de068a88f49ed7a2f13e9717039733b)), closes [#166](https://github.com/motion-canvas/motion-canvas/issues/166)
* **ui:** add quarter resolution ([#421](https://github.com/motion-canvas/motion-canvas/issues/421)) ([d0160d0](https://github.com/motion-canvas/motion-canvas/commit/d0160d0d5ef76ffb0d3591566891b5efa4061744))


### BREAKING CHANGES

* `makeProject` no longer accepts some settings.

Settings such as `background` and `audioOffset` are now stored in the project
meta file.





# [3.0.0-alpha.0](https://github.com/motion-canvas/motion-canvas/compare/v2.6.0...v3.0.0-alpha.0) (2023-02-26)


### Features

* new playback architecture ([#402](https://github.com/motion-canvas/motion-canvas/issues/402)) ([bbe3e2a](https://github.com/motion-canvas/motion-canvas/commit/bbe3e2a24de068a88f49ed7a2f13e9717039733b)), closes [#166](https://github.com/motion-canvas/motion-canvas/issues/166)
* **ui:** add quarter resolution ([#421](https://github.com/motion-canvas/motion-canvas/issues/421)) ([d0160d0](https://github.com/motion-canvas/motion-canvas/commit/d0160d0d5ef76ffb0d3591566891b5efa4061744))


### BREAKING CHANGES

* `makeProject` no longer accepts some settings.

Settings such as `background` and `audioOffset` are now stored in the project
meta file.





# [2.6.0](https://github.com/motion-canvas/motion-canvas/compare/v2.5.0...v2.6.0) (2023-02-24)

**Note:** Version bump only for package @motion-canvas/ui





# [2.5.0](https://github.com/motion-canvas/motion-canvas/compare/v2.4.0...v2.5.0) (2023-02-20)

**Note:** Version bump only for package @motion-canvas/ui





# [2.4.0](https://github.com/motion-canvas/motion-canvas/compare/v2.3.0...v2.4.0) (2023-02-18)


### Bug Fixes

* **ui:** fix inspector tab ([#374](https://github.com/motion-canvas/motion-canvas/issues/374)) ([c4cb378](https://github.com/motion-canvas/motion-canvas/commit/c4cb378c2f9d972bb41542bbe3b3aa314fa1f3ad))


### Features

* **ui:** add external link to docs ([#346](https://github.com/motion-canvas/motion-canvas/issues/346)) ([fc4ee5d](https://github.com/motion-canvas/motion-canvas/commit/fc4ee5d028312904ed9e11c5341ac00f36e7242b))
* **ui:** shift + right arrow moves to last frame ([#354](https://github.com/motion-canvas/motion-canvas/issues/354)) ([4b81709](https://github.com/motion-canvas/motion-canvas/commit/4b8170971400c5bf4fe690a58d3f44c3e1d00b94)), closes [#353](https://github.com/motion-canvas/motion-canvas/issues/353)





# [2.3.0](https://github.com/motion-canvas/motion-canvas/compare/v2.2.0...v2.3.0) (2023-02-11)


### Bug Fixes

* **ui:** fix play-pause button ([#299](https://github.com/motion-canvas/motion-canvas/issues/299)) ([191f54a](https://github.com/motion-canvas/motion-canvas/commit/191f54a0a5a9de2fd2dc27bffc6d21d692ce6f72))
* **ui:** remove glossy <select> effect in Safari ([#292](https://github.com/motion-canvas/motion-canvas/issues/292)) ([9c062b2](https://github.com/motion-canvas/motion-canvas/commit/9c062b26e48fbdb1905daae25a3fb34df82307d3))





# [2.2.0](https://github.com/motion-canvas/motion-canvas/compare/v2.1.0...v2.2.0) (2023-02-09)

**Note:** Version bump only for package @motion-canvas/ui





# [2.1.0](https://github.com/motion-canvas/motion-canvas/compare/v2.0.0...v2.1.0) (2023-02-07)

**Note:** Version bump only for package @motion-canvas/ui





# 2.0.0 (2023-02-04)


### Bug Fixes

* fix player state not being saved ([#85](https://github.com/motion-canvas/motion-canvas/issues/85)) ([74b54b9](https://github.com/motion-canvas/motion-canvas/commit/74b54b970d1287e80fe2334a034844ad6a80c23b))
* fix tsdoc comments ([#21](https://github.com/motion-canvas/motion-canvas/issues/21)) ([4b6cb66](https://github.com/motion-canvas/motion-canvas/commit/4b6cb660ad82befcfd41188c7a8f9c8c0cba93ed)), closes [#18](https://github.com/motion-canvas/motion-canvas/issues/18)
* support hmr when navigating ([370ea16](https://github.com/motion-canvas/motion-canvas/commit/370ea1676a1c34313c0fb917c0f0691538f72016))
* the resolution fields in Rendering no longer reset each other ([#73](https://github.com/motion-canvas/motion-canvas/issues/73)) ([ddabec5](https://github.com/motion-canvas/motion-canvas/commit/ddabec549be3cecec27cf9f5643b036e12a83472))
* **ui:** don't seek when editing time events ([#26](https://github.com/motion-canvas/motion-canvas/issues/26)) ([524c200](https://github.com/motion-canvas/motion-canvas/commit/524c200ef1bd6a6f52096d04c2aeed24a24cda6f))
* **ui:** downgrade preact ([#1](https://github.com/motion-canvas/motion-canvas/issues/1)) ([5f7456f](https://github.com/motion-canvas/motion-canvas/commit/5f7456fe4c5a1cc76ccd8fed5a6f9a8a4e846d27))
* **ui:** misaligned overlay ([#127](https://github.com/motion-canvas/motion-canvas/issues/127)) ([0379730](https://github.com/motion-canvas/motion-canvas/commit/03797302a302e28caf9f2428cfce4a122f827775))
* **ui:** prevent context menu in viewport ([#123](https://github.com/motion-canvas/motion-canvas/issues/123)) ([0fdd85e](https://github.com/motion-canvas/motion-canvas/commit/0fdd85ecf5b61907ce1e16f5fb9253540528a8b0))
* **ui:** prevent timeline scroll when zooming ([#162](https://github.com/motion-canvas/motion-canvas/issues/162)) ([b8278ae](https://github.com/motion-canvas/motion-canvas/commit/b8278aeb7b92f215bccbd1aa57de17c9233cff01))
* use correct scene sizes ([#146](https://github.com/motion-canvas/motion-canvas/issues/146)) ([f279638](https://github.com/motion-canvas/motion-canvas/commit/f279638f9ad7ed1f4c44900d48c10c2d6560946e))


### Features

* add basic logger ([#88](https://github.com/motion-canvas/motion-canvas/issues/88)) ([3d82e86](https://github.com/motion-canvas/motion-canvas/commit/3d82e863af3dc88b3709adbcd0b84e790d05c3b8)), closes [#17](https://github.com/motion-canvas/motion-canvas/issues/17)
* add basic transform to Node class ([#83](https://github.com/motion-canvas/motion-canvas/issues/83)) ([9e114c8](https://github.com/motion-canvas/motion-canvas/commit/9e114c8830a99c78e6a4fd9265b0e7552758af14))
* add E2E testing ([#101](https://github.com/motion-canvas/motion-canvas/issues/101)) ([6398c54](https://github.com/motion-canvas/motion-canvas/commit/6398c54e4c4d6667ce9f45b9bbef6ea110ea2215)), closes [#42](https://github.com/motion-canvas/motion-canvas/issues/42)
* add inspection ([#82](https://github.com/motion-canvas/motion-canvas/issues/82)) ([4d7f2ae](https://github.com/motion-canvas/motion-canvas/commit/4d7f2aee6daeda1a2146b632dfdc28b455295776))
* add markdown logs ([#138](https://github.com/motion-canvas/motion-canvas/issues/138)) ([e42447a](https://github.com/motion-canvas/motion-canvas/commit/e42447a0c07a8192c06d21c5f1801f0266279075))
* add rendering again ([#43](https://github.com/motion-canvas/motion-canvas/issues/43)) ([c10d3db](https://github.com/motion-canvas/motion-canvas/commit/c10d3dbb63f6248eda04128ef0aa9d72c1edfcf7))
* add video node ([#86](https://github.com/motion-canvas/motion-canvas/issues/86)) ([f4aa654](https://github.com/motion-canvas/motion-canvas/commit/f4aa65437a18cc85b00199f80cd5e04654c00c4b))
* added file type and quality options to rendering panel ([#50](https://github.com/motion-canvas/motion-canvas/issues/50)) ([bee71ef](https://github.com/motion-canvas/motion-canvas/commit/bee71ef2673c269db47a4433831720b7ad0fb4e8)), closes [#24](https://github.com/motion-canvas/motion-canvas/issues/24)
* animation player ([#92](https://github.com/motion-canvas/motion-canvas/issues/92)) ([8155118](https://github.com/motion-canvas/motion-canvas/commit/8155118eb13dc2a8b422b81aabacc923ce2f919b))
* better dependencies between packages ([#152](https://github.com/motion-canvas/motion-canvas/issues/152)) ([a0a37b3](https://github.com/motion-canvas/motion-canvas/commit/a0a37b3645fcb91206e65fd0a95b2f486b308c75))
* better dependencies between packages ([#153](https://github.com/motion-canvas/motion-canvas/issues/153)) ([59a73d4](https://github.com/motion-canvas/motion-canvas/commit/59a73d49a7b92c416e1f836a0f53bb676e9f924b))
* **core:** switch to vitest ([#99](https://github.com/motion-canvas/motion-canvas/issues/99)) ([762eeb0](https://github.com/motion-canvas/motion-canvas/commit/762eeb0a99c2f378d20dbd147f815ba6736099d9)), closes [#48](https://github.com/motion-canvas/motion-canvas/issues/48)
* detect circular signal dependencies ([#129](https://github.com/motion-canvas/motion-canvas/issues/129)) ([6fcdb41](https://github.com/motion-canvas/motion-canvas/commit/6fcdb41df90dca1c39537a4f6d4960ab551f4d6e))
* editor improvements ([#121](https://github.com/motion-canvas/motion-canvas/issues/121)) ([e8b32ce](https://github.com/motion-canvas/motion-canvas/commit/e8b32ceff1b8216282c4b5713508ce1172645e20))
* make exporting concurrent ([4f9ef8d](https://github.com/motion-canvas/motion-canvas/commit/4f9ef8d40d9d9c1147e2edfc0766c5ea5cc4297c))
* minor console improvements ([#145](https://github.com/motion-canvas/motion-canvas/issues/145)) ([3e32e73](https://github.com/motion-canvas/motion-canvas/commit/3e32e73434ad872049af9e3f1f711bc0185410f4))
* navigate to scene and node source ([#144](https://github.com/motion-canvas/motion-canvas/issues/144)) ([86d495d](https://github.com/motion-canvas/motion-canvas/commit/86d495d01a9f8f0a58e676fedb6df9c12a14d14a))
* open time events in editor ([#87](https://github.com/motion-canvas/motion-canvas/issues/87)) ([74b781d](https://github.com/motion-canvas/motion-canvas/commit/74b781d57fca7ef1d10904673276f2a7354c01b8))
* support for multiple projects ([#57](https://github.com/motion-canvas/motion-canvas/issues/57)) ([573752d](https://github.com/motion-canvas/motion-canvas/commit/573752dd4d79d62a1a30958f1ed550d2cf22c344)), closes [#141414](https://github.com/motion-canvas/motion-canvas/issues/141414)
* support multiple players ([#128](https://github.com/motion-canvas/motion-canvas/issues/128)) ([24f75cf](https://github.com/motion-canvas/motion-canvas/commit/24f75cf7cdaf38f890e3936edf175afbfd340210))
* switch to Vite ([#28](https://github.com/motion-canvas/motion-canvas/issues/28)) ([65b9133](https://github.com/motion-canvas/motion-canvas/commit/65b91337dbc47fe51cecc83657f79fab15343a0d)), closes [#141414](https://github.com/motion-canvas/motion-canvas/issues/141414) [#13](https://github.com/motion-canvas/motion-canvas/issues/13)
* **ui:** timeline overhaul ([#47](https://github.com/motion-canvas/motion-canvas/issues/47)) ([4232a60](https://github.com/motion-canvas/motion-canvas/commit/4232a6072540b54451e99e18c1001db0175bb93f)), closes [#20](https://github.com/motion-canvas/motion-canvas/issues/20)
* **ui:** visual changes ([#96](https://github.com/motion-canvas/motion-canvas/issues/96)) ([3d599f4](https://github.com/motion-canvas/motion-canvas/commit/3d599f4e1788fbd15e996be8bf95679f1c6787bd))
* unify core types ([#71](https://github.com/motion-canvas/motion-canvas/issues/71)) ([9c5853d](https://github.com/motion-canvas/motion-canvas/commit/9c5853d8bc65204693c38109a25d1fefd44241b7))


### Reverts

* "ci(release): 9.1.3 [skip ci]" ([62953a6](https://github.com/motion-canvas/motion-canvas/commit/62953a6a8a1b1da3eb2e5f51c9fe60c716d6b94b))
* ci(release): 1.0.1 [skip ci] ([#175](https://github.com/motion-canvas/motion-canvas/issues/175)) ([161a046](https://github.com/motion-canvas/motion-canvas/commit/161a04647ecdc8203daf2d887a6a44c79a92ee20))
* ci(release): 2.0.0 [skip ci] ([#176](https://github.com/motion-canvas/motion-canvas/issues/176)) ([551096b](https://github.com/motion-canvas/motion-canvas/commit/551096bf636a791ea7c7c1d38d8e03c360433008))


### BREAKING CHANGES

* change the overall structure of a project

`vite` and `@motion-canvas/vite-plugin` packages are now required to build a project:
```
npm i -D vite @motion-canvas/vite-plugin
```
The following `vite.config.ts` file needs to be created in the root of the project:
```ts
import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';

export default defineConfig({
  plugins: [motionCanvas()],
});
```

Types exposed by Motion Canvas are no longer global.
An additional `motion-canvas.d.ts` file needs to be created in the `src` directory:
```ts
/// <reference types="@motion-canvas/core/project" />
```

 Finally, the `bootstrap` function no longer exists.
 Project files should export an instance of the `Project` class instead:
 ```ts
 import {Project} from '@motion-canvas/core/lib';

 import example from './scenes/example.scene';

 export default new Project({
   name: 'project',
   scenes: [example],
   // same options as in bootstrap() are available:
