# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0](https://github.com/motion-canvas/motion-canvas/compare/v2.6.0...v3.0.0) (2023-02-27)


### Bug Fixes

* **2d:** fix initial value of endOffset ([#433](https://github.com/motion-canvas/motion-canvas/issues/433)) ([9fe82b3](https://github.com/motion-canvas/motion-canvas/commit/9fe82b3d21ba0150a2378e541a4652ca707c2d15))
* **2d:** fix performance issue with audio track ([#427](https://github.com/motion-canvas/motion-canvas/issues/427)) ([c993770](https://github.com/motion-canvas/motion-canvas/commit/c993770937ddfdf0ac39b144a1f79f1a300f7899))
* **2d:** textDirection property for RTL/LTR text ([#404](https://github.com/motion-canvas/motion-canvas/issues/404)) ([f240b1b](https://github.com/motion-canvas/motion-canvas/commit/f240b1bd140a884f6901b7cfcb97ce3e9ce4b48d))
* **core:** clear semi-transparent backgrounds ([#424](https://github.com/motion-canvas/motion-canvas/issues/424)) ([1ebff1c](https://github.com/motion-canvas/motion-canvas/commit/1ebff1c92bebce56d11c61eb9dadca47f5a80ac1)), closes [#423](https://github.com/motion-canvas/motion-canvas/issues/423)
* **core:** fix Vector2.exactlyEquals ([#437](https://github.com/motion-canvas/motion-canvas/issues/437)) ([028d264](https://github.com/motion-canvas/motion-canvas/commit/028d26499d8f3fb34500b22e8dcde2d080c2e2b0))
* **core:** render only within the range ([#436](https://github.com/motion-canvas/motion-canvas/issues/436)) ([36ccebe](https://github.com/motion-canvas/motion-canvas/commit/36ccebe5321d84eeaa16f8b74a79c1001ee7ac0b))
* **ui:** correctly reset zoom ([#432](https://github.com/motion-canvas/motion-canvas/issues/432)) ([a33ee14](https://github.com/motion-canvas/motion-canvas/commit/a33ee14dfac3e1fe24c89d76631e23fe4cb625a6))


### Code Refactoring

* introduce improved names ([#425](https://github.com/motion-canvas/motion-canvas/issues/425)) ([4a2188d](https://github.com/motion-canvas/motion-canvas/commit/4a2188d339587fa658b2134befc3fe63c835c5d7))


### Features

* new playback architecture ([#402](https://github.com/motion-canvas/motion-canvas/issues/402)) ([bbe3e2a](https://github.com/motion-canvas/motion-canvas/commit/bbe3e2a24de068a88f49ed7a2f13e9717039733b)), closes [#166](https://github.com/motion-canvas/motion-canvas/issues/166)
* **ui:** add quarter resolution ([#421](https://github.com/motion-canvas/motion-canvas/issues/421)) ([d0160d0](https://github.com/motion-canvas/motion-canvas/commit/d0160d0d5ef76ffb0d3591566891b5efa4061744))


### Reverts

* feat: upgrade code-fns for new theme options and lazy loading ([#435](https://github.com/motion-canvas/motion-canvas/issues/435)) ([3f5e439](https://github.com/motion-canvas/motion-canvas/commit/3f5e43968f7add7c6322c9c8358d3b6fc178c2fe))


### BREAKING CHANGES

* multiple name changes

To avoid collisions, names of certain classes have changed:
- `Text => Txt`
- `Image => Img`
- `Rect (type) => BBox`

Cache related methods of `Node` have changed:
- `getCacheRect => getCacheBBox`
- `cacheRect => cacheBBox`
- `fullCacheRect => fullCacheBBox`

The `CodeBlock` property has changed:
- `CodeBlock.selectionOpacity => CodeBlock.unselectedOpacity`
* `makeProject` no longer accepts some settings.

Settings such as `background` and `audioOffset` are now stored in the project
meta file.





# [2.6.0](https://github.com/motion-canvas/motion-canvas/compare/v2.5.0...v2.6.0) (2023-02-24)


### Bug Fixes

* **2d:** handle division by zero in lines ([#407](https://github.com/motion-canvas/motion-canvas/issues/407)) ([a17871a](https://github.com/motion-canvas/motion-canvas/commit/a17871a2ce63dd5bb32bc719037327c4e9dde217))


### Features

* **2d:** add Icon Component ([#306](https://github.com/motion-canvas/motion-canvas/issues/306)) ([3479631](https://github.com/motion-canvas/motion-canvas/commit/3479631ef34e39f90a8d8de441317672be1840d9)), closes [#305](https://github.com/motion-canvas/motion-canvas/issues/305)
* **2d:** add save and restore methods to nodes ([#406](https://github.com/motion-canvas/motion-canvas/issues/406)) ([870e194](https://github.com/motion-canvas/motion-canvas/commit/870e1947d97382bc6d82857c077140bbef7cf7e8))
* **2d:** add z-index property to nodes ([#398](https://github.com/motion-canvas/motion-canvas/issues/398)) ([4280af3](https://github.com/motion-canvas/motion-canvas/commit/4280af3b4b7bd5970fe5e743949a0fcca2c314f3))
* add missing flexbox properties ([#405](https://github.com/motion-canvas/motion-canvas/issues/405)) ([4e78b4b](https://github.com/motion-canvas/motion-canvas/commit/4e78b4b2fe4df42ce0a8da6fd41ad38b0104e7f5))
* **docs:** improve the release blog ([#410](https://github.com/motion-canvas/motion-canvas/issues/410)) ([f56bbdb](https://github.com/motion-canvas/motion-canvas/commit/f56bbdb4a95e62035f277737ea5fba675e591270))
* upgrade code-fns for new theme options and lazy loading ([#401](https://github.com/motion-canvas/motion-canvas/issues/401)) ([8965ab1](https://github.com/motion-canvas/motion-canvas/commit/8965ab1bef8b6ae919c8001d0527f5793293b285)), closes [#396](https://github.com/motion-canvas/motion-canvas/issues/396) [#322](https://github.com/motion-canvas/motion-canvas/issues/322)
* **vite-plugin:** add CORS Proxy ([#357](https://github.com/motion-canvas/motion-canvas/issues/357)) ([a3c5822](https://github.com/motion-canvas/motion-canvas/commit/a3c58228b7d3dab08fc27414d19870d35773b280)), closes [#338](https://github.com/motion-canvas/motion-canvas/issues/338)





# [2.5.0](https://github.com/motion-canvas/motion-canvas/compare/v2.4.0...v2.5.0) (2023-02-20)


### Bug Fixes

* **2d:** fix signal initialization ([#382](https://github.com/motion-canvas/motion-canvas/issues/382)) ([ea36e79](https://github.com/motion-canvas/motion-canvas/commit/ea36e791a20bfd1b491ffa9917be686c51bc3899))
* **2d:** handle floating point errors in acos ([#381](https://github.com/motion-canvas/motion-canvas/issues/381)) ([5bca8fd](https://github.com/motion-canvas/motion-canvas/commit/5bca8fd0bbdcf28f2793c124b7d6b0afd560c4b8))
* plug memory leaks ([#385](https://github.com/motion-canvas/motion-canvas/issues/385)) ([de0af00](https://github.com/motion-canvas/motion-canvas/commit/de0af00a7d2e019e2a933791c62b7901755be7b0))
* support color to null tweening ([#387](https://github.com/motion-canvas/motion-canvas/issues/387)) ([02e9f22](https://github.com/motion-canvas/motion-canvas/commit/02e9f22027a1c3a85ffcc259aeca913318fb6f54))


### Features

* **2d:** add closed property for circle ([#378](https://github.com/motion-canvas/motion-canvas/issues/378)) ([62a9605](https://github.com/motion-canvas/motion-canvas/commit/62a9605d4c54e7bf2d2d44d47bf769f5b27378a5))
* **2d:** make `View2D` extend `Rect` ([#379](https://github.com/motion-canvas/motion-canvas/issues/379)) ([93db5fc](https://github.com/motion-canvas/motion-canvas/commit/93db5fc41617c0902e85fda90fbfc930c2b4634b))
* **core:** add fadeTransition ([#384](https://github.com/motion-canvas/motion-canvas/issues/384)) ([a248785](https://github.com/motion-canvas/motion-canvas/commit/a248785e87d1c6ebc08581f4fda6be428a89824c))
* **core:** add spring interpolation ([#356](https://github.com/motion-canvas/motion-canvas/issues/356)) ([1463b15](https://github.com/motion-canvas/motion-canvas/commit/1463b1592e22fad9d8298c11270e2099119e2229))
* **core:** add step parameter to range function ([#373](https://github.com/motion-canvas/motion-canvas/issues/373)) ([923209a](https://github.com/motion-canvas/motion-canvas/commit/923209a4106c8e7f570853dcc47a10e65e0d04d8))





# [2.4.0](https://github.com/motion-canvas/motion-canvas/compare/v2.3.0...v2.4.0) (2023-02-18)


### Bug Fixes

* **2d:** fix Gradient and Pattern signals ([#376](https://github.com/motion-canvas/motion-canvas/issues/376)) ([6e0dc8a](https://github.com/motion-canvas/motion-canvas/commit/6e0dc8af8d19f93fd6a42addca2b3a2958b4dd33))
* **2d:** fix layout calculation for nodes not explicitly added to view ([#331](https://github.com/motion-canvas/motion-canvas/issues/331)) ([528e2d5](https://github.com/motion-canvas/motion-canvas/commit/528e2d5a0abec99819e022d2848b256ece9f869a))
* **2d:** format whitespaces according to HTML ([#372](https://github.com/motion-canvas/motion-canvas/issues/372)) ([83fb565](https://github.com/motion-canvas/motion-canvas/commit/83fb565742d98f060c0400c8cbaf9961b69f34d0)), closes [#370](https://github.com/motion-canvas/motion-canvas/issues/370)
* **core:** playback speed is reset after saving with faulty code ([#204](https://github.com/motion-canvas/motion-canvas/issues/204)). ([#339](https://github.com/motion-canvas/motion-canvas/issues/339)) ([6771e5e](https://github.com/motion-canvas/motion-canvas/commit/6771e5e17edcdc4cce074d7da0962cf71ba6c228))
* **docs:** fix search ([#336](https://github.com/motion-canvas/motion-canvas/issues/336)) ([e44ec02](https://github.com/motion-canvas/motion-canvas/commit/e44ec02539a67f099471a6aa84f673a236494687))
* typo on codeblock remove comments ([#368](https://github.com/motion-canvas/motion-canvas/issues/368)) ([2025adc](https://github.com/motion-canvas/motion-canvas/commit/2025adc6e7aa11d81b6f5f6989e8eae18cf86cb7))
* **ui:** fix inspector tab ([#374](https://github.com/motion-canvas/motion-canvas/issues/374)) ([c4cb378](https://github.com/motion-canvas/motion-canvas/commit/c4cb378c2f9d972bb41542bbe3b3aa314fa1f3ad))
* **vite-plugin:** fix js template ([#337](https://github.com/motion-canvas/motion-canvas/issues/337)) ([3b33d73](https://github.com/motion-canvas/motion-canvas/commit/3b33d73416541d491b633bada29f085f5489f6c2))
* **vite-plugin:** ignore query param in devserver ([#351](https://github.com/motion-canvas/motion-canvas/issues/351)) ([5644d72](https://github.com/motion-canvas/motion-canvas/commit/5644d72d36adcdc817f0856aaff0be5507338cb8))


### Features

* **2d:** add default computed values for signals ([#259](https://github.com/motion-canvas/motion-canvas/issues/259)) ([18f61a6](https://github.com/motion-canvas/motion-canvas/commit/18f61a668420dec8afba52d52a6557e7a7919ba2))
* **2d:** add moveBelow, moveAbove and moveTo methods to Node ([#365](https://github.com/motion-canvas/motion-canvas/issues/365)) ([16752a3](https://github.com/motion-canvas/motion-canvas/commit/16752a3b8ae7461b33d6208a9675729f374e8324))
* **2d:** unify layout properties ([#355](https://github.com/motion-canvas/motion-canvas/issues/355)) ([3cae97e](https://github.com/motion-canvas/motion-canvas/commit/3cae97ea704d0533020fa87326dacadcc037d517)), closes [#352](https://github.com/motion-canvas/motion-canvas/issues/352)
* **core:** add Matrix2D type ([#340](https://github.com/motion-canvas/motion-canvas/issues/340)) ([66b41e6](https://github.com/motion-canvas/motion-canvas/commit/66b41e6beaca5c2ba4b6bd1a7e68ca16d183b0e9))
* **core:** error double event name ([#341](https://github.com/motion-canvas/motion-canvas/issues/341)) ([053b2a6](https://github.com/motion-canvas/motion-canvas/commit/053b2a6c22c4e726e3962fdaf0a2e8d149889a9b))
* **docs:** add search ([#335](https://github.com/motion-canvas/motion-canvas/issues/335)) ([48f74a6](https://github.com/motion-canvas/motion-canvas/commit/48f74a60d54cc52c7f069a9ec39071c99163bd19))
* **docs:** added CodeBlock documentation ([#302](https://github.com/motion-canvas/motion-canvas/issues/302)) ([73f7221](https://github.com/motion-canvas/motion-canvas/commit/73f7221536e09d5cf77f75ca173d1a7637d5b98f))
* **ui:** add external link to docs ([#346](https://github.com/motion-canvas/motion-canvas/issues/346)) ([fc4ee5d](https://github.com/motion-canvas/motion-canvas/commit/fc4ee5d028312904ed9e11c5341ac00f36e7242b))
* **ui:** shift + right arrow moves to last frame ([#354](https://github.com/motion-canvas/motion-canvas/issues/354)) ([4b81709](https://github.com/motion-canvas/motion-canvas/commit/4b8170971400c5bf4fe690a58d3f44c3e1d00b94)), closes [#353](https://github.com/motion-canvas/motion-canvas/issues/353)





# [2.3.0](https://github.com/motion-canvas/motion-canvas/compare/v2.2.0...v2.3.0) (2023-02-11)


### Bug Fixes

* **2d:** make Text respect textWrap=pre ([#287](https://github.com/motion-canvas/motion-canvas/issues/287)) ([cb07f4b](https://github.com/motion-canvas/motion-canvas/commit/cb07f4bdf07edc8a086b934ca5ab769682b9a010))
* **ui:** fix play-pause button ([#299](https://github.com/motion-canvas/motion-canvas/issues/299)) ([191f54a](https://github.com/motion-canvas/motion-canvas/commit/191f54a0a5a9de2fd2dc27bffc6d21d692ce6f72))
* **ui:** remove glossy <select> effect in Safari ([#292](https://github.com/motion-canvas/motion-canvas/issues/292)) ([9c062b2](https://github.com/motion-canvas/motion-canvas/commit/9c062b26e48fbdb1905daae25a3fb34df82307d3))


### Features

* **2d:** add antialiased signal to Shape ([#282](https://github.com/motion-canvas/motion-canvas/issues/282)) ([7c6905d](https://github.com/motion-canvas/motion-canvas/commit/7c6905d72c6c2f49e10f0a80704c0afe3504d01b))
* **2d:** add LaTeX component ([#228](https://github.com/motion-canvas/motion-canvas/issues/228)) ([4c26d2a](https://github.com/motion-canvas/motion-canvas/commit/4c26d2aaf0c697486639aa917cd5c585d3d0ea74))
* **2d:** add smooth corners and sharpness to rect ([#310](https://github.com/motion-canvas/motion-canvas/issues/310)) ([f7fbefd](https://github.com/motion-canvas/motion-canvas/commit/f7fbefd27f7f6972cfb5a45a68e5d0aed9593ae4))
* added a theme property to the CodeBlock component ([#279](https://github.com/motion-canvas/motion-canvas/issues/279)) ([fe34fa8](https://github.com/motion-canvas/motion-canvas/commit/fe34fa8ebfe66cd356fb1c3d85adedef11e03b45))
* **core:** add `debug` helper function ([#293](https://github.com/motion-canvas/motion-canvas/issues/293)) ([b870873](https://github.com/motion-canvas/motion-canvas/commit/b8708732af0fc08d9ff9eeecbbb77d65f1b36eb8))
* **core:** additional easing functions ([#274](https://github.com/motion-canvas/motion-canvas/issues/274)) ([f81ce43](https://github.com/motion-canvas/motion-canvas/commit/f81ce43019fe253e99f4ab6311c2251b40e2eae3))
* **core:** disallow tweening to/from undefined values ([#257](https://github.com/motion-canvas/motion-canvas/issues/257)) ([d4bb791](https://github.com/motion-canvas/motion-canvas/commit/d4bb79145300b52c4b4d101df2afaff5ea11a9e9))
* **docs:** always re-build api references in `build` mode ([#298](https://github.com/motion-canvas/motion-canvas/issues/298)) ([27a4d96](https://github.com/motion-canvas/motion-canvas/commit/27a4d96593d8e925385252b0d6f62646cd9fa6d5)), closes [#294](https://github.com/motion-canvas/motion-canvas/issues/294)





# [2.2.0](https://github.com/motion-canvas/motion-canvas/compare/v2.1.0...v2.2.0) (2023-02-09)


### Features

* **2d:** add video component property getter ([#240](https://github.com/motion-canvas/motion-canvas/issues/240)) ([59de5ab](https://github.com/motion-canvas/motion-canvas/commit/59de5ab2c089589773a2f9ad7588eda7d72693a7))
* project variables ([#255](https://github.com/motion-canvas/motion-canvas/issues/255)) ([4883295](https://github.com/motion-canvas/motion-canvas/commit/488329525939928af52b4a4d8488f1e1cd4cf6f7))





# [2.1.0](https://github.com/motion-canvas/motion-canvas/compare/v2.0.0...v2.1.0) (2023-02-07)


### Bug Fixes

* **2d:** fix font ligatures in CodeBlock ([#231](https://github.com/motion-canvas/motion-canvas/issues/231)) ([11ee3fe](https://github.com/motion-canvas/motion-canvas/commit/11ee3fef5ad878313cf19833df6881333ced4dac))
* **2d:** fix Line cache ([#232](https://github.com/motion-canvas/motion-canvas/issues/232)) ([a953b64](https://github.com/motion-canvas/motion-canvas/commit/a953b64540c020657845efc84d4179142a7a0974)), closes [#205](https://github.com/motion-canvas/motion-canvas/issues/205)
* **2d:** handle lines with no points ([#233](https://github.com/motion-canvas/motion-canvas/issues/233)) ([8108474](https://github.com/motion-canvas/motion-canvas/commit/81084743dfad7b6419760796fda825047909d4d4)), closes [#212](https://github.com/motion-canvas/motion-canvas/issues/212)
* **2d:** improve Rect radius ([#221](https://github.com/motion-canvas/motion-canvas/issues/221)) ([3437e42](https://github.com/motion-canvas/motion-canvas/commit/3437e42713a3f4a8d44d246ee01e2eb23b61e06a)), closes [#207](https://github.com/motion-canvas/motion-canvas/issues/207)
* **2d:** stop code highlighting from jumping ([#230](https://github.com/motion-canvas/motion-canvas/issues/230)) ([67ef1c4](https://github.com/motion-canvas/motion-canvas/commit/67ef1c497056dd1f8f9e20d1d7fc1af03ec3849e))
* **core:** fix looping ([#217](https://github.com/motion-canvas/motion-canvas/issues/217)) ([a38e1a7](https://github.com/motion-canvas/motion-canvas/commit/a38e1a7c8fc21384cc17f3f982802071b8cd0cbf)), closes [#178](https://github.com/motion-canvas/motion-canvas/issues/178)
* **docs:** fix typo in configuration.mdx ([#185](https://github.com/motion-canvas/motion-canvas/issues/185)) ([ca67529](https://github.com/motion-canvas/motion-canvas/commit/ca67529925d3483cb84a36e852e5bad79c3861eb))
* fix compound property setter ([#218](https://github.com/motion-canvas/motion-canvas/issues/218)) ([6cd1b95](https://github.com/motion-canvas/motion-canvas/commit/6cd1b952df950554eb637c9f8e82947c415d00c5)), closes [#208](https://github.com/motion-canvas/motion-canvas/issues/208) [#210](https://github.com/motion-canvas/motion-canvas/issues/210)
* **vite-plugin:** add missing headers to html ([#219](https://github.com/motion-canvas/motion-canvas/issues/219)) ([2552bcf](https://github.com/motion-canvas/motion-canvas/commit/2552bcfbe2e90f3d4b86810d39f8cee24349e405)), closes [#201](https://github.com/motion-canvas/motion-canvas/issues/201)


### Features

* add `useDuration` helper ([#226](https://github.com/motion-canvas/motion-canvas/issues/226)) ([fa97d6c](https://github.com/motion-canvas/motion-canvas/commit/fa97d6c7f076f287c9b86d2f8852341bd368ef1c)), closes [#171](https://github.com/motion-canvas/motion-canvas/issues/171)





# 2.0.0 (2023-02-04)


### Bug Fixes

* **2d:** add missing shape export ([#111](https://github.com/motion-canvas/motion-canvas/issues/111)) ([02a1fa7](https://github.com/motion-canvas/motion-canvas/commit/02a1fa7ea62155e498809f2e57ff29a18c82ac12))
* **2d:** fix import order ([#94](https://github.com/motion-canvas/motion-canvas/issues/94)) ([bcc0bcf](https://github.com/motion-canvas/motion-canvas/commit/bcc0bcffae47855bd8f7ab06454aaebe93c4aa24)), closes [#76](https://github.com/motion-canvas/motion-canvas/issues/76)
* **2d:** fix Line overview crashing ([#142](https://github.com/motion-canvas/motion-canvas/issues/142)) ([6bd5fd9](https://github.com/motion-canvas/motion-canvas/commit/6bd5fd941e583e44f5d920ecd20215efb1eed58a))
* **2d:** some signal setters not returning owners ([#143](https://github.com/motion-canvas/motion-canvas/issues/143)) ([09ab7f9](https://github.com/motion-canvas/motion-canvas/commit/09ab7f96afcaae608399a653c0b4878ba9b467d4))
* **2d:** switch iframes to ShadowDOM ([#90](https://github.com/motion-canvas/motion-canvas/issues/90)) ([86176be](https://github.com/motion-canvas/motion-canvas/commit/86176be055c08aba59272afcda00ed586f6c7ad6))
* add missing Arrow setters ([#82](https://github.com/motion-canvas/motion-canvas/issues/82)) ([49843c9](https://github.com/motion-canvas/motion-canvas/commit/49843c9d38ee75de50ffc241d2a615be78f9e1f5))
* add missing canvas package ([26c8f4f](https://github.com/motion-canvas/motion-canvas/commit/26c8f4ff9947841b38f123466b7efd7f43706ffb))
* add missing public path ([#40](https://github.com/motion-canvas/motion-canvas/issues/40)) ([48213de](https://github.com/motion-canvas/motion-canvas/commit/48213de087d6bb35f29919f5588e3a4517e080b6))
* add monospace font fallback in case JetBrains Mono is missing ([#24](https://github.com/motion-canvas/motion-canvas/issues/24)) ([276a310](https://github.com/motion-canvas/motion-canvas/commit/276a310d63a4ea128a3640d6e0871045514c1c01)), closes [#16](https://github.com/motion-canvas/motion-canvas/issues/16)
* bug with createEaseInOutBack in interpolationFunctions.ts ([#69](https://github.com/motion-canvas/motion-canvas/issues/69)) ([2b95876](https://github.com/motion-canvas/motion-canvas/commit/2b958768a6d01f81e4fde51a018209e0fe800f8f))
* change executable file permissions ([#38](https://github.com/motion-canvas/motion-canvas/issues/38)) ([23025a2](https://github.com/motion-canvas/motion-canvas/commit/23025a2caefd993f7e4751b1efced3a25ed497a6))
* code will trigger PrismJS such that JSX is correctly highlighted ([#20](https://github.com/motion-canvas/motion-canvas/issues/20)) ([b323231](https://github.com/motion-canvas/motion-canvas/commit/b32323184b5f479bc09950fdf9c570b5276ea600)), closes [#17](https://github.com/motion-canvas/motion-canvas/issues/17)
* **core:** add missing type references ([#41](https://github.com/motion-canvas/motion-canvas/issues/41)) ([325c244](https://github.com/motion-canvas/motion-canvas/commit/325c2442814ca19407fe0060a819aded4456f90e))
* **core:** keep falsy values with deepTween ([#45](https://github.com/motion-canvas/motion-canvas/issues/45)) ([93c934f](https://github.com/motion-canvas/motion-canvas/commit/93c934f9b59462581267cca5033bf132b831ce54))
* create missing output directories ([#13](https://github.com/motion-canvas/motion-canvas/issues/13)) ([17f1e3f](https://github.com/motion-canvas/motion-canvas/commit/17f1e3fd37ec89998d67b22bd6762fc85b4778a2)), closes [#4](https://github.com/motion-canvas/motion-canvas/issues/4)
* **create:** fix package type ([#40](https://github.com/motion-canvas/motion-canvas/issues/40)) ([f07aa5d](https://github.com/motion-canvas/motion-canvas/commit/f07aa5d8f6c3485464ed3158187340c7db7d5af7))
* detect missing meta files ([#83](https://github.com/motion-canvas/motion-canvas/issues/83)) ([d1e2193](https://github.com/motion-canvas/motion-canvas/commit/d1e219361c7f61673073b377917c88d82f0e5d9e)), closes [#79](https://github.com/motion-canvas/motion-canvas/issues/79)
* display newlines in Code correctly ([#38](https://github.com/motion-canvas/motion-canvas/issues/38)) ([df8f390](https://github.com/motion-canvas/motion-canvas/commit/df8f390848d7a8e03193d64e460142e00ed95031))
* **docs:** fix a typo ([#55](https://github.com/motion-canvas/motion-canvas/issues/55)) ([2691148](https://github.com/motion-canvas/motion-canvas/commit/26911481fa5f3d1f76ecd550ba6f61f44bac6124))
* **docs:** fix broken links ([#105](https://github.com/motion-canvas/motion-canvas/issues/105)) ([f79427d](https://github.com/motion-canvas/motion-canvas/commit/f79427d588190908ba4015b7820d529f25e64e6a))
* **docs:** fix links to examples ([#106](https://github.com/motion-canvas/motion-canvas/issues/106)) ([d445b56](https://github.com/motion-canvas/motion-canvas/commit/d445b564746bb5e8cbabcddaa9857ffec80a8755))
* **docs:** fix small typo ([#107](https://github.com/motion-canvas/motion-canvas/issues/107)) ([fe6cbb0](https://github.com/motion-canvas/motion-canvas/commit/fe6cbb0083407f3de4594c76692a417bf4f616ee))
* **docs:** improve predicate type ([#148](https://github.com/motion-canvas/motion-canvas/issues/148)) ([3abee4f](https://github.com/motion-canvas/motion-canvas/commit/3abee4f89ef467a48eb68382ac6d46d443ad28d9))
* **docs:** name collisions between members ([#117](https://github.com/motion-canvas/motion-canvas/issues/117)) ([1e52b94](https://github.com/motion-canvas/motion-canvas/commit/1e52b945cac15dc7da2d9db8fbcf5d88ba293c6f))
* **docs:** small corrections ([#108](https://github.com/motion-canvas/motion-canvas/issues/108)) ([9212343](https://github.com/motion-canvas/motion-canvas/commit/921234377bad7bb0f334c5dda04498cce26f7891))
* empty time events crashing ([a1c53de](https://github.com/motion-canvas/motion-canvas/commit/a1c53deba7c405ddf1a3b4874f22b63e0b085af9))
* fix docs workflow ([#102](https://github.com/motion-canvas/motion-canvas/issues/102)) ([f591169](https://github.com/motion-canvas/motion-canvas/commit/f5911699a7ae6b970ee4c0de891383a9c0cd5d0d))
* fix docs workflow ([#103](https://github.com/motion-canvas/motion-canvas/issues/103)) ([b9e2006](https://github.com/motion-canvas/motion-canvas/commit/b9e20063be6aab75471d2a91cf862ac5bdc70e12))
* fix docs workflow ([#104](https://github.com/motion-canvas/motion-canvas/issues/104)) ([7e59a1a](https://github.com/motion-canvas/motion-canvas/commit/7e59a1a5f77f4be65e599f539e16f6cf58785d9c))
* fix hot reload ([#26](https://github.com/motion-canvas/motion-canvas/issues/26)) ([2ad746e](https://github.com/motion-canvas/motion-canvas/commit/2ad746e1eff705c2eb29ea9c83ad9810eeb54b05))
* fix meta file version and timing ([#32](https://github.com/motion-canvas/motion-canvas/issues/32)) ([a369610](https://github.com/motion-canvas/motion-canvas/commit/a36961007eb7ac238b87ade3a03da101a1940800))
* fix player state not being saved ([#85](https://github.com/motion-canvas/motion-canvas/issues/85)) ([74b54b9](https://github.com/motion-canvas/motion-canvas/commit/74b54b970d1287e80fe2334a034844ad6a80c23b))
* fix scaffolding ([#93](https://github.com/motion-canvas/motion-canvas/issues/93)) ([95c55ed](https://github.com/motion-canvas/motion-canvas/commit/95c55ed338127dad22f42b24c8f6b101b8863be7))
* fix tsdoc comments ([#21](https://github.com/motion-canvas/motion-canvas/issues/21)) ([4b6cb66](https://github.com/motion-canvas/motion-canvas/commit/4b6cb660ad82befcfd41188c7a8f9c8c0cba93ed)), closes [#18](https://github.com/motion-canvas/motion-canvas/issues/18)
* **legacy:** add missing files ([#61](https://github.com/motion-canvas/motion-canvas/issues/61)) ([fad87d5](https://github.com/motion-canvas/motion-canvas/commit/fad87d5aa5500e7c63cb914fc51044db6225502e))
* load project state correctly ([#27](https://github.com/motion-canvas/motion-canvas/issues/27)) ([8ae0233](https://github.com/motion-canvas/motion-canvas/commit/8ae02335d71858413bffb265573bd83a1e38d89e))
* make panes scrollable ([#14](https://github.com/motion-canvas/motion-canvas/issues/14)) ([dc9fd38](https://github.com/motion-canvas/motion-canvas/commit/dc9fd380285c9dfcc6d8503cca87c32e01f11381))
* marked index.mjs as executable such that the cli will run on linux ([#47](https://github.com/motion-canvas/motion-canvas/issues/47)) ([722d5eb](https://github.com/motion-canvas/motion-canvas/commit/722d5eb72b8f4659ff93f57737d70f2650b91f81)), closes [#46](https://github.com/motion-canvas/motion-canvas/issues/46)
* MeshBoneMaterial opacity ([24db561](https://github.com/motion-canvas/motion-canvas/commit/24db5613aca19e5de2672aaf31f422e51aee19c8))
* pre-commit hook will now work on linux and mac ([#51](https://github.com/motion-canvas/motion-canvas/issues/51)) ([ef80035](https://github.com/motion-canvas/motion-canvas/commit/ef80035ff7f67f48339049e9f0ded60c79180cb6))
* prevent scrolling timeline with arrow keys ([#4](https://github.com/motion-canvas/motion-canvas/issues/4)) ([dfc8108](https://github.com/motion-canvas/motion-canvas/commit/dfc8108976f5c20a4b4a44bee788ee71011769c6))
* previous scene being rendered twice ([#97](https://github.com/motion-canvas/motion-canvas/issues/97)) ([90205bd](https://github.com/motion-canvas/motion-canvas/commit/90205bdc1a086abe5f73b04cb4616c6af5ec4377))
* previous scene invisible when seeking ([65e32f0](https://github.com/motion-canvas/motion-canvas/commit/65e32f03b79af730064c935eaf1645019c303399))
* previous scenes not getting disposed ([bf3a1fc](https://github.com/motion-canvas/motion-canvas/commit/bf3a1fcf5fc22758893b5b742ca00a5741a5d560))
* range middle-click expansion ([1c0b724](https://github.com/motion-canvas/motion-canvas/commit/1c0b7243cffa3e33779b736ecce2dad19880f796))
* re-render the scene when canvas changes ([#55](https://github.com/motion-canvas/motion-canvas/issues/55)) ([191f96d](https://github.com/motion-canvas/motion-canvas/commit/191f96da1441bc37d6e61e1acdcfde6994a7f9f3))
* remove inconsistency in playhead controls ([#1](https://github.com/motion-canvas/motion-canvas/issues/1)) ([58cdb4a](https://github.com/motion-canvas/motion-canvas/commit/58cdb4a26144f9933dba64d687fa63d442f115bd))
* respect child origins in LinearLayout ([5ee114d](https://github.com/motion-canvas/motion-canvas/commit/5ee114ddd9e48d6cea5360ea090c17f1dbc8c641))
* restrict the corner radius of a rectangle ([#9](https://github.com/motion-canvas/motion-canvas/issues/9)) ([cc86a4a](https://github.com/motion-canvas/motion-canvas/commit/cc86a4a6d5b44e75ed02a1bdf90b588450a663b2)), closes [#8](https://github.com/motion-canvas/motion-canvas/issues/8)
* save time events only if they're actively used ([#35](https://github.com/motion-canvas/motion-canvas/issues/35)) ([bd78c89](https://github.com/motion-canvas/motion-canvas/commit/bd78c8967ba395beeb352006b5f33768b4a4c498)), closes [#33](https://github.com/motion-canvas/motion-canvas/issues/33) [#34](https://github.com/motion-canvas/motion-canvas/issues/34)
* save timeline state ([9d57b8a](https://github.com/motion-canvas/motion-canvas/commit/9d57b8ae1f7cfd6ec468d3348aa0fda4afd88a84))
* support hmr when navigating ([370ea16](https://github.com/motion-canvas/motion-canvas/commit/370ea1676a1c34313c0fb917c0f0691538f72016))
* support nested threads ([#84](https://github.com/motion-canvas/motion-canvas/issues/84)) ([4a4a95f](https://github.com/motion-canvas/motion-canvas/commit/4a4a95f5891b5ec674f67f6b889abe4e855509ac))
* the resolution fields in Rendering no longer reset each other ([#73](https://github.com/motion-canvas/motion-canvas/issues/73)) ([ddabec5](https://github.com/motion-canvas/motion-canvas/commit/ddabec549be3cecec27cf9f5643b036e12a83472))
* timeline will no longer seek when scrolling using the scrollbar ([#19](https://github.com/motion-canvas/motion-canvas/issues/19)) ([c1b1680](https://github.com/motion-canvas/motion-canvas/commit/c1b168065814edfe7dc4283366a98826c7d93d88))
* **ui:** don't seek when editing time events ([#26](https://github.com/motion-canvas/motion-canvas/issues/26)) ([524c200](https://github.com/motion-canvas/motion-canvas/commit/524c200ef1bd6a6f52096d04c2aeed24a24cda6f))
* **ui:** downgrade preact ([#1](https://github.com/motion-canvas/motion-canvas/issues/1)) ([5f7456f](https://github.com/motion-canvas/motion-canvas/commit/5f7456fe4c5a1cc76ccd8fed5a6f9a8a4e846d27))
* **ui:** misaligned overlay ([#127](https://github.com/motion-canvas/motion-canvas/issues/127)) ([0379730](https://github.com/motion-canvas/motion-canvas/commit/03797302a302e28caf9f2428cfce4a122f827775))
* **ui:** prevent context menu in viewport ([#123](https://github.com/motion-canvas/motion-canvas/issues/123)) ([0fdd85e](https://github.com/motion-canvas/motion-canvas/commit/0fdd85ecf5b61907ce1e16f5fb9253540528a8b0))
* **ui:** prevent timeline scroll when zooming ([#162](https://github.com/motion-canvas/motion-canvas/issues/162)) ([b8278ae](https://github.com/motion-canvas/motion-canvas/commit/b8278aeb7b92f215bccbd1aa57de17c9233cff01))
* use correct scene sizes ([#146](https://github.com/motion-canvas/motion-canvas/issues/146)) ([f279638](https://github.com/motion-canvas/motion-canvas/commit/f279638f9ad7ed1f4c44900d48c10c2d6560946e))


### Code Refactoring

* remove legacy package ([6a84120](https://github.com/motion-canvas/motion-canvas/commit/6a84120d949a32dff0ad413a9f359510ff109af1))


### Features

* **2d:** add methods for rearranging children ([#81](https://github.com/motion-canvas/motion-canvas/issues/81)) ([63f6c1a](https://github.com/motion-canvas/motion-canvas/commit/63f6c1aa51ac4ecd093151c8cd30910f2e72bcac))
* **2d:** add option for preformatted text ([#147](https://github.com/motion-canvas/motion-canvas/issues/147)) ([989be53](https://github.com/motion-canvas/motion-canvas/commit/989be532d86642e1125bb7fa62a801b09c1b8f26))
* **2d:** code selection and modification ([#163](https://github.com/motion-canvas/motion-canvas/issues/163)) ([e8e884a](https://github.com/motion-canvas/motion-canvas/commit/e8e884a1a5574425dbf15272718911c12cfa2327))
* **2d:** construct lines using signals ([#133](https://github.com/motion-canvas/motion-canvas/issues/133)) ([2968a24](https://github.com/motion-canvas/motion-canvas/commit/2968a2426564469fb4f4343fe71a6d30e95361f2))
* **2d:** improve property declarations ([27e7d26](https://github.com/motion-canvas/motion-canvas/commit/27e7d267ee91bf1e8ca79686b6ec31347f9f4d41))
* **2d:** improve Rect corner radius ([#120](https://github.com/motion-canvas/motion-canvas/issues/120)) ([b471fe0](https://github.com/motion-canvas/motion-canvas/commit/b471fe0e37c0a426d3af8299c9c3c22539e7df05))
* **2d:** simplify layout prop ([c24cb12](https://github.com/motion-canvas/motion-canvas/commit/c24cb12a22b7c85fdfb051917fa9ee1e0911717c))
* **2d:** unify desired sizes ([#118](https://github.com/motion-canvas/motion-canvas/issues/118)) ([401a799](https://github.com/motion-canvas/motion-canvas/commit/401a79946b034a96b9abff2f3fb5efd6cc9080f3))
* add advanced caching ([#69](https://github.com/motion-canvas/motion-canvas/issues/69)) ([2a644c9](https://github.com/motion-canvas/motion-canvas/commit/2a644c9315acfcc5280a5eacc9904df140a61e4f))
* add base class for shapes ([#67](https://github.com/motion-canvas/motion-canvas/issues/67)) ([d38c172](https://github.com/motion-canvas/motion-canvas/commit/d38c1724e129c553739cbfc27c4e5cd8f737f067))
* add basic documentation structure ([#10](https://github.com/motion-canvas/motion-canvas/issues/10)) ([1e46433](https://github.com/motion-canvas/motion-canvas/commit/1e46433af37e8fec18dec6efc7dc1e3b70d9a869)), closes [#2](https://github.com/motion-canvas/motion-canvas/issues/2)
* add basic logger ([#88](https://github.com/motion-canvas/motion-canvas/issues/88)) ([3d82e86](https://github.com/motion-canvas/motion-canvas/commit/3d82e863af3dc88b3709adbcd0b84e790d05c3b8)), closes [#17](https://github.com/motion-canvas/motion-canvas/issues/17)
* add basic transform to Node class ([#83](https://github.com/motion-canvas/motion-canvas/issues/83)) ([9e114c8](https://github.com/motion-canvas/motion-canvas/commit/9e114c8830a99c78e6a4fd9265b0e7552758af14))
* add cloning ([#80](https://github.com/motion-canvas/motion-canvas/issues/80)) ([47d7a0f](https://github.com/motion-canvas/motion-canvas/commit/47d7a0fa5da9a03d8ed91557db651f6f960e28b1))
* add CodeBlock component based on code-fns to 2D ([#78](https://github.com/motion-canvas/motion-canvas/issues/78)) ([ad346f1](https://github.com/motion-canvas/motion-canvas/commit/ad346f118d63b1e321ec315e1c70b925670124a1))
* add default renderer ([#63](https://github.com/motion-canvas/motion-canvas/issues/63)) ([9255490](https://github.com/motion-canvas/motion-canvas/commit/92554900965fe088538f5e703dbab2fd84f904d7)), closes [#56](https://github.com/motion-canvas/motion-canvas/issues/56) [#58](https://github.com/motion-canvas/motion-canvas/issues/58)
* add deprecation support ([#130](https://github.com/motion-canvas/motion-canvas/issues/130)) ([da0e104](https://github.com/motion-canvas/motion-canvas/commit/da0e104451af72eedb3eedd998f60b305fffdb0e))
* add docs to monorepo ([#22](https://github.com/motion-canvas/motion-canvas/issues/22)) ([129d557](https://github.com/motion-canvas/motion-canvas/commit/129d557004c63df7a4ed514d0503709f03cf6e6b))
* add E2E testing ([#101](https://github.com/motion-canvas/motion-canvas/issues/101)) ([6398c54](https://github.com/motion-canvas/motion-canvas/commit/6398c54e4c4d6667ce9f45b9bbef6ea110ea2215)), closes [#42](https://github.com/motion-canvas/motion-canvas/issues/42)
* add ease back interp functions ([#30](https://github.com/motion-canvas/motion-canvas/issues/30)) ([c11046d](https://github.com/motion-canvas/motion-canvas/commit/c11046d939bf5a29e28bda0ef97feabe2f985a0f))
* add eslint ([658f468](https://github.com/motion-canvas/motion-canvas/commit/658f468318c8ad88088bd5230172fb4d0bc2af00))
* add Grid node ([e1f83da](https://github.com/motion-canvas/motion-canvas/commit/e1f83da1f43d20d392df4acb11e3df9cc457585d))
* add inspection ([#82](https://github.com/motion-canvas/motion-canvas/issues/82)) ([4d7f2ae](https://github.com/motion-canvas/motion-canvas/commit/4d7f2aee6daeda1a2146b632dfdc28b455295776))
* add layered layout ([381b2c0](https://github.com/motion-canvas/motion-canvas/commit/381b2c083d90aa4fe815370afd0138dde114bf4a))
* add LayoutText ([328b7b7](https://github.com/motion-canvas/motion-canvas/commit/328b7b7f193b60223269002812f29922bc78132e))
* add markdown logs ([#138](https://github.com/motion-canvas/motion-canvas/issues/138)) ([e42447a](https://github.com/motion-canvas/motion-canvas/commit/e42447a0c07a8192c06d21c5f1801f0266279075))
* add meta files ([#28](https://github.com/motion-canvas/motion-canvas/issues/28)) ([e29f7d0](https://github.com/motion-canvas/motion-canvas/commit/e29f7d0ed01c7fb84f0931be5485fdde1aa0a5c2)), closes [#7](https://github.com/motion-canvas/motion-canvas/issues/7)
* add missing layout props ([#72](https://github.com/motion-canvas/motion-canvas/issues/72)) ([f808a56](https://github.com/motion-canvas/motion-canvas/commit/f808a562b192fd03dba4b0d353284db344d6a80b))
* add node spawners ([#149](https://github.com/motion-canvas/motion-canvas/issues/149)) ([da18a4e](https://github.com/motion-canvas/motion-canvas/commit/da18a4e24104022a84ecd6cec1666b520186058f))
* add polyline ([#84](https://github.com/motion-canvas/motion-canvas/issues/84)) ([4ceaf84](https://github.com/motion-canvas/motion-canvas/commit/4ceaf842915ac43d81f292c58a4dc73a8d1bb8e9))
* add pull request verification ([d91bab5](https://github.com/motion-canvas/motion-canvas/commit/d91bab55832fed3e494842e9e17eed5281efecbb))
* add random number generator ([#116](https://github.com/motion-canvas/motion-canvas/issues/116)) ([d505312](https://github.com/motion-canvas/motion-canvas/commit/d5053123eef308c7a2a61d92b6e76c637f4ed0b8)), closes [#14](https://github.com/motion-canvas/motion-canvas/issues/14)
* add rendering again ([#43](https://github.com/motion-canvas/motion-canvas/issues/43)) ([c10d3db](https://github.com/motion-canvas/motion-canvas/commit/c10d3dbb63f6248eda04128ef0aa9d72c1edfcf7))
* add reparent helper ([80b95a9](https://github.com/motion-canvas/motion-canvas/commit/80b95a9ce89d4a2eeea7e467257486e961602d69))
* add scaffolding package ([#36](https://github.com/motion-canvas/motion-canvas/issues/36)) ([266a561](https://github.com/motion-canvas/motion-canvas/commit/266a561c619b57b403ec9c64185985b48bff29da)), closes [#30](https://github.com/motion-canvas/motion-canvas/issues/30)
* add support for meta files ([#11](https://github.com/motion-canvas/motion-canvas/issues/11)) ([456790a](https://github.com/motion-canvas/motion-canvas/commit/456790ab8c88bf28baa4843078013ff881c1a439))
* add support for npm workspaces ([741567f](https://github.com/motion-canvas/motion-canvas/commit/741567f8af4185a2b1bc5284064514d96e75f5f2))
* add Text and Image components ([#70](https://github.com/motion-canvas/motion-canvas/issues/70)) ([85c7dcd](https://github.com/motion-canvas/motion-canvas/commit/85c7dcdb4f8ca2f0bfb03950c85a8d6f6652fcdf))
* add video node ([#86](https://github.com/motion-canvas/motion-canvas/issues/86)) ([f4aa654](https://github.com/motion-canvas/motion-canvas/commit/f4aa65437a18cc85b00199f80cd5e04654c00c4b))
* added color space option to Project and Player ([#89](https://github.com/motion-canvas/motion-canvas/issues/89)) ([e1e2ac4](https://github.com/motion-canvas/motion-canvas/commit/e1e2ac44ea35a9280b31e57fb365a227c7d2bba0)), closes [#80](https://github.com/motion-canvas/motion-canvas/issues/80)
* added Color Space option to Rendering panel  ([#24](https://github.com/motion-canvas/motion-canvas/issues/24)) ([33f691d](https://github.com/motion-canvas/motion-canvas/commit/33f691de086dbdb40841ba04a0ba5446a06056bb))
* added custom resolution inputs to the rendering pane ([#20](https://github.com/motion-canvas/motion-canvas/issues/20)) ([1f799b6](https://github.com/motion-canvas/motion-canvas/commit/1f799b695e54f6cf3a16ede61a82a53be2e0c803))
* added deepTween function and rewrote colorTween to use colorjs.io ([#88](https://github.com/motion-canvas/motion-canvas/issues/88)) ([eb7ca3c](https://github.com/motion-canvas/motion-canvas/commit/eb7ca3c8974ab2b2c905338a01e900c8938805b5)), closes [#73](https://github.com/motion-canvas/motion-canvas/issues/73) [#78](https://github.com/motion-canvas/motion-canvas/issues/78)
* added file type and quality options to rendering panel ([#50](https://github.com/motion-canvas/motion-canvas/issues/50)) ([bee71ef](https://github.com/motion-canvas/motion-canvas/commit/bee71ef2673c269db47a4433831720b7ad0fb4e8)), closes [#24](https://github.com/motion-canvas/motion-canvas/issues/24)
* added useContext and useContextAfter hooks ([#63](https://github.com/motion-canvas/motion-canvas/issues/63)) ([352e131](https://github.com/motion-canvas/motion-canvas/commit/352e13104361389e81d96eadeb41a680eaafafdb)), closes [#58](https://github.com/motion-canvas/motion-canvas/issues/58)
* animation player ([#92](https://github.com/motion-canvas/motion-canvas/issues/92)) ([8155118](https://github.com/motion-canvas/motion-canvas/commit/8155118eb13dc2a8b422b81aabacc923ce2f919b))
* AnimationClip ([681146a](https://github.com/motion-canvas/motion-canvas/commit/681146a8e92a4360975472939eb2494b89f02eff))
* arc tween ratio ([27dbb0b](https://github.com/motion-canvas/motion-canvas/commit/27dbb0bd2749600cdee6944a469ee10870989a28))
* audio offset ([88f40aa](https://github.com/motion-canvas/motion-canvas/commit/88f40aa93bb23090058965bd7d76b81106804c05))
* audio playback ([e9a6fdb](https://github.com/motion-canvas/motion-canvas/commit/e9a6fdb51e62dd8e7a0ca43e7ae6908ff7d92c53))
* audio toggle control ([300f18e](https://github.com/motion-canvas/motion-canvas/commit/300f18e9c9c0ad559edb14bbfce889a717ab15c2))
* audio waveform track ([9aff955](https://github.com/motion-canvas/motion-canvas/commit/9aff955ef472644834d1232b90a93b935127fffd))
* better dependencies between packages ([#152](https://github.com/motion-canvas/motion-canvas/issues/152)) ([a0a37b3](https://github.com/motion-canvas/motion-canvas/commit/a0a37b3645fcb91206e65fd0a95b2f486b308c75))
* better dependencies between packages ([#153](https://github.com/motion-canvas/motion-canvas/issues/153)) ([59a73d4](https://github.com/motion-canvas/motion-canvas/commit/59a73d49a7b92c416e1f836a0f53bb676e9f924b))
* better naming conventions ([#62](https://github.com/motion-canvas/motion-canvas/issues/62)) ([a9d764f](https://github.com/motion-canvas/motion-canvas/commit/a9d764fbceb639497ef45f44c90f9b6e408213d3))
* better playback controls ([796ae33](https://github.com/motion-canvas/motion-canvas/commit/796ae3356c4853a38e1e6471cb62e73b47f02fd2))
* better time events ([8c2bf27](https://github.com/motion-canvas/motion-canvas/commit/8c2bf27ac7bac9d6f77a15ec99d433baa4329c0e))
* better time events ([1acd71b](https://github.com/motion-canvas/motion-canvas/commit/1acd71bb4d13d927040b42a8f77faf87ee185a3b))
* blob rendering ([4dff949](https://github.com/motion-canvas/motion-canvas/commit/4dff949de9a7cfa781e9738c625c5c46d63e1da5))
* browser based renderer ([13dc24c](https://github.com/motion-canvas/motion-canvas/commit/13dc24ca69e31dab911cc1211b56684c28425e85))
* circular mask for surfaces ([4db62d8](https://github.com/motion-canvas/motion-canvas/commit/4db62d8a6572dda0931e0826f2fab359ee9accad))
* clamp function ([94543d1](https://github.com/motion-canvas/motion-canvas/commit/94543d1079a46d9a8c8d26b87bd91dc2c5e17aea))
* color picker ([ac48055](https://github.com/motion-canvas/motion-canvas/commit/ac48055b4ffd833fb1fca6fcd0b2fd7d38a57aab))
* configurable framerate and resolution ([a715f5c](https://github.com/motion-canvas/motion-canvas/commit/a715f5c1acd28e2e1dd5496ea8cb4b23b4cea7be))
* configurable framerate and resolution ([a591683](https://github.com/motion-canvas/motion-canvas/commit/a591683f93e92f1f41ad89fd7d23eea67d32e3ac))
* connections ([49254fc](https://github.com/motion-canvas/motion-canvas/commit/49254fc36cc03c8f8557c14ff86ab38f56229b04))
* **core:** add configurable line numbers ([#44](https://github.com/motion-canvas/motion-canvas/issues/44)) ([831334c](https://github.com/motion-canvas/motion-canvas/commit/831334ca32a504991e875af37446fef4f055c285)), closes [#12](https://github.com/motion-canvas/motion-canvas/issues/12)
* **core:** switch to vitest ([#99](https://github.com/motion-canvas/motion-canvas/issues/99)) ([762eeb0](https://github.com/motion-canvas/motion-canvas/commit/762eeb0a99c2f378d20dbd147f815ba6736099d9)), closes [#48](https://github.com/motion-canvas/motion-canvas/issues/48)
* create new release ([20282e9](https://github.com/motion-canvas/motion-canvas/commit/20282e9745a42c5bf62d104afe65fa71fbd973a2))
* custom loaders ([5a3ab9a](https://github.com/motion-canvas/motion-canvas/commit/5a3ab9ad4d2d332d99d594c8812adc32a8d4b04c))
* decouple Konva from core ([#54](https://github.com/motion-canvas/motion-canvas/issues/54)) ([02b5c75](https://github.com/motion-canvas/motion-canvas/commit/02b5c75dba482dcf90a626142c8952f29009e299)), closes [#49](https://github.com/motion-canvas/motion-canvas/issues/49) [#31](https://github.com/motion-canvas/motion-canvas/issues/31)
* detect circular signal dependencies ([#129](https://github.com/motion-canvas/motion-canvas/issues/129)) ([6fcdb41](https://github.com/motion-canvas/motion-canvas/commit/6fcdb41df90dca1c39537a4f6d4960ab551f4d6e))
* directional padding and margin ([441d121](https://github.com/motion-canvas/motion-canvas/commit/441d1210adbd85406d7dbe2edc21da044724a1ee))
* display time in seconds ([0290a9c](https://github.com/motion-canvas/motion-canvas/commit/0290a9cb0775693a4cde7d1fa3bee90c9329dcfb))
* **docs:** add logo ([#23](https://github.com/motion-canvas/motion-canvas/issues/23)) ([78698e4](https://github.com/motion-canvas/motion-canvas/commit/78698e40a428d5a1aa469fbdad9c7c88e82230bc))
* **docs:** add migration guide for v10 ([#37](https://github.com/motion-canvas/motion-canvas/issues/37)) ([0905daa](https://github.com/motion-canvas/motion-canvas/commit/0905daa60f42943554555834339d3ab70fe9b9c3))
* **docs:** visual changes ([be83edf](https://github.com/motion-canvas/motion-canvas/commit/be83edf847fb35cc77590ff5720f9eca79e9b787))
* editor improvements ([#121](https://github.com/motion-canvas/motion-canvas/issues/121)) ([e8b32ce](https://github.com/motion-canvas/motion-canvas/commit/e8b32ceff1b8216282c4b5713508ce1172645e20))
* extract konva to separate package ([#60](https://github.com/motion-canvas/motion-canvas/issues/60)) ([4ecad3c](https://github.com/motion-canvas/motion-canvas/commit/4ecad3ca2732bd5147af670c230f8f959129a707))
* filter reordering ([#119](https://github.com/motion-canvas/motion-canvas/issues/119)) ([2398d0f](https://github.com/motion-canvas/motion-canvas/commit/2398d0f9d57f36b47c9c66a988ca5607e9a3a30e))
* follow utility ([fddfc67](https://github.com/motion-canvas/motion-canvas/commit/fddfc67a42fc0f8e2a6f76d00a30c813592caf9e))
* force rendering to restart seek time ([#14](https://github.com/motion-canvas/motion-canvas/issues/14)) ([e94027a](https://github.com/motion-canvas/motion-canvas/commit/e94027a36fe2a0b11f3aa42bb3fa869c10fbe1ea)), closes [#6](https://github.com/motion-canvas/motion-canvas/issues/6)
* framerate-independent timing ([#64](https://github.com/motion-canvas/motion-canvas/issues/64)) ([6891f59](https://github.com/motion-canvas/motion-canvas/commit/6891f5974145878bc18f200e70cff5117ac32bd3)), closes [#57](https://github.com/motion-canvas/motion-canvas/issues/57)
* function components ([178db3d](https://github.com/motion-canvas/motion-canvas/commit/178db3d95c091e9abdf79e67548836332f40dc89))
* general improvements ([320cced](https://github.com/motion-canvas/motion-canvas/commit/320ccede3d764b8aabbcea2d92ee808efa36708a))
* general improvements ([dbff3cc](https://github.com/motion-canvas/motion-canvas/commit/dbff3cce379fb18eec5900ef9d90ba752ab826b4))
* grid ([d201a4d](https://github.com/motion-canvas/motion-canvas/commit/d201a4d09393001f7106c2f33b17b49434f047e7))
* grid and debug overlays ([895a53a](https://github.com/motion-canvas/motion-canvas/commit/895a53ab4222c8d57a3e0d924181ee370b1356d7))
* grid overlay ([f7aca18](https://github.com/motion-canvas/motion-canvas/commit/f7aca1854c390c90bea3614180eb73b1f91375b8))
* implement absolute scale setter ([842079a](https://github.com/motion-canvas/motion-canvas/commit/842079a6547af4032719c85837df3db7c1c6d30a))
* implement properties tab ([#10](https://github.com/motion-canvas/motion-canvas/issues/10)) ([e882a7f](https://github.com/motion-canvas/motion-canvas/commit/e882a7f52315a63508035899037cbab3278c1553))
* improve async signals ([#156](https://github.com/motion-canvas/motion-canvas/issues/156)) ([db27b9d](https://github.com/motion-canvas/motion-canvas/commit/db27b9d5fb69a88f42afd98c86c4a1cdceb88ea1))
* improve layouts ([9a1fb5c](https://github.com/motion-canvas/motion-canvas/commit/9a1fb5c7cd740a6f696c907a8f1d8ed900995985))
* improve surface clipping ([#41](https://github.com/motion-canvas/motion-canvas/issues/41)) ([003b7d5](https://github.com/motion-canvas/motion-canvas/commit/003b7d58d6490170cea81b2d1b37cf59b4d698cf))
* introduce basic caching ([#68](https://github.com/motion-canvas/motion-canvas/issues/68)) ([6420d36](https://github.com/motion-canvas/motion-canvas/commit/6420d362d0e4ae058f55b6ff6bb2a3a32dec559b))
* jsx ([3a633e8](https://github.com/motion-canvas/motion-canvas/commit/3a633e882714c85043c014f98cad2d5d30b40607))
* keyboard shortcuts ([4a3a7b5](https://github.com/motion-canvas/motion-canvas/commit/4a3a7b53bccd89bd1dd93207e3e1b9640bdf6102))
* layouts ([749f929](https://github.com/motion-canvas/motion-canvas/commit/749f9297beae67bfa61cfcdf45806329574b75d1))
* loading indication ([93638d5](https://github.com/motion-canvas/motion-canvas/commit/93638d5e056711fa0f0473d20d16074d9c6f3fd5))
* make exporting concurrent ([4f9ef8d](https://github.com/motion-canvas/motion-canvas/commit/4f9ef8d40d9d9c1147e2edfc0766c5ea5cc4297c))
* make scenes independent of names ([#53](https://github.com/motion-canvas/motion-canvas/issues/53)) ([417617e](https://github.com/motion-canvas/motion-canvas/commit/417617eb5f0af771e7413c9ce4c7e9b998e3e490)), closes [#25](https://github.com/motion-canvas/motion-canvas/issues/25)
* make surfaces transparent by default ([#42](https://github.com/motion-canvas/motion-canvas/issues/42)) ([cd71285](https://github.com/motion-canvas/motion-canvas/commit/cd712857579ec45b3e6f40d0e48fce80fefed5b9)), closes [#25](https://github.com/motion-canvas/motion-canvas/issues/25)
* mask animation ([5771963](https://github.com/motion-canvas/motion-canvas/commit/57719638cbca8f93c0e36f9380bfbe557a8633cd))
* merge properties and signals ([#124](https://github.com/motion-canvas/motion-canvas/issues/124)) ([da3ba83](https://github.com/motion-canvas/motion-canvas/commit/da3ba83d82ee74f5a5c3631b07597f08cdf9e8e4))
* minor console improvements ([#145](https://github.com/motion-canvas/motion-canvas/issues/145)) ([3e32e73](https://github.com/motion-canvas/motion-canvas/commit/3e32e73434ad872049af9e3f1f711bc0185410f4))
* minor improvements ([403c7c2](https://github.com/motion-canvas/motion-canvas/commit/403c7c27ad969880a14c498ec6cefb9e7e7b7544))
* minor improvements ([#77](https://github.com/motion-canvas/motion-canvas/issues/77)) ([7c6e584](https://github.com/motion-canvas/motion-canvas/commit/7c6e584aca353c9af55f0acb61b32b5f99727dba))
* move back playhead by a frame ([#18](https://github.com/motion-canvas/motion-canvas/issues/18)) ([b944cd7](https://github.com/motion-canvas/motion-canvas/commit/b944cd71c075e10622bd7bc81de90024c73438b7))
* navigate to scene and node source ([#144](https://github.com/motion-canvas/motion-canvas/issues/144)) ([86d495d](https://github.com/motion-canvas/motion-canvas/commit/86d495d01a9f8f0a58e676fedb6df9c12a14d14a))
* new animator ([#91](https://github.com/motion-canvas/motion-canvas/issues/91)) ([d85f2f8](https://github.com/motion-canvas/motion-canvas/commit/d85f2f8a54c0f8bbfbc451884385f30e5b3ec206))
* open time events in editor ([#87](https://github.com/motion-canvas/motion-canvas/issues/87)) ([74b781d](https://github.com/motion-canvas/motion-canvas/commit/74b781d57fca7ef1d10904673276f2a7354c01b8))
* package separation ([e69a566](https://github.com/motion-canvas/motion-canvas/commit/e69a56635fbc073766018c8e53139a2135dbca10))
* pan with shift and left click ([#7](https://github.com/motion-canvas/motion-canvas/issues/7)) ([4ff8241](https://github.com/motion-canvas/motion-canvas/commit/4ff82419bd0066c8efa2675b196c273b7105a7ca)), closes [#5](https://github.com/motion-canvas/motion-canvas/issues/5)
* playback controls ([94dab5d](https://github.com/motion-canvas/motion-canvas/commit/94dab5dc1b8deaa4eaab561454699b3c22393618))
* **player:** add auto mode ([c107259](https://github.com/motion-canvas/motion-canvas/commit/c107259f7c2a3886ccfe4ca0140d13064aed238f))
* **player:** improve accessibility ([0fc9235](https://github.com/motion-canvas/motion-canvas/commit/0fc923576e7b12f9bc799f3a4e861861d49a2406))
* Promise support ([711f793](https://github.com/motion-canvas/motion-canvas/commit/711f7937d86a9a0b2b7011b25799499d786e056d))
* remove strongly-typed-events ([#48](https://github.com/motion-canvas/motion-canvas/issues/48)) ([41947b5](https://github.com/motion-canvas/motion-canvas/commit/41947b5ab6a2ec69d963f3445d1ea65d835c73ff))
* remove ui elements ([8e5c288](https://github.com/motion-canvas/motion-canvas/commit/8e5c288750dfe9f697939abac03678b7885df428))
* renderer ui ([8a4e5d3](https://github.com/motion-canvas/motion-canvas/commit/8a4e5d32b1e55f054bf3e98ef54c49f66655c034))
* rendering ([60ccda7](https://github.com/motion-canvas/motion-canvas/commit/60ccda723361751f28bc1144de314388551c95a2))
* replaced `scene.transition` with `useTransition` ([#68](https://github.com/motion-canvas/motion-canvas/issues/68)) ([f521115](https://github.com/motion-canvas/motion-canvas/commit/f521115889a7f341e03b4e7ee7530a70f37760d8)), closes [#56](https://github.com/motion-canvas/motion-canvas/issues/56)
* scene transitions ([d45f1d3](https://github.com/motion-canvas/motion-canvas/commit/d45f1d36bd23fbb5d07c6865ae31e624cba11bd2))
* sidebar ([d5345ba](https://github.com/motion-canvas/motion-canvas/commit/d5345ba444296b1648fab17274e241d879054833))
* signal error handling ([#89](https://github.com/motion-canvas/motion-canvas/issues/89)) ([472ac65](https://github.com/motion-canvas/motion-canvas/commit/472ac65938b804a6b698c8522ec0c3b6bdbcf1b1))
* simplify size access ([#65](https://github.com/motion-canvas/motion-canvas/issues/65)) ([3315e64](https://github.com/motion-canvas/motion-canvas/commit/3315e64641e9778bc48ea3fb707e3c0eeb581dfe))
* simplify size access further ([#66](https://github.com/motion-canvas/motion-canvas/issues/66)) ([9091a5e](https://github.com/motion-canvas/motion-canvas/commit/9091a5e05d8fadf72c50832c7c4467ac4424b72c))
* simplify the process of importing images ([#39](https://github.com/motion-canvas/motion-canvas/issues/39)) ([0c2341f](https://github.com/motion-canvas/motion-canvas/commit/0c2341fe255ee1702181e04f4cd2024a9eeabce5)), closes [#19](https://github.com/motion-canvas/motion-canvas/issues/19)
* sprites and threading ([a541682](https://github.com/motion-canvas/motion-canvas/commit/a5416828bfb5d40f92c695b8a9a6df7b2d6686ca))
* support for multiple projects ([#57](https://github.com/motion-canvas/motion-canvas/issues/57)) ([573752d](https://github.com/motion-canvas/motion-canvas/commit/573752dd4d79d62a1a30958f1ed550d2cf22c344)), closes [#141414](https://github.com/motion-canvas/motion-canvas/issues/141414)
* support lower framerate ([3c81086](https://github.com/motion-canvas/motion-canvas/commit/3c81086829ad12dda805c355649cce7c0f156d2e))
* support multiple players ([#128](https://github.com/motion-canvas/motion-canvas/issues/128)) ([24f75cf](https://github.com/motion-canvas/motion-canvas/commit/24f75cf7cdaf38f890e3936edf175afbfd340210))
* surfaceFrom animation ([77bb69e](https://github.com/motion-canvas/motion-canvas/commit/77bb69e6a6481d412f800f65b6303c4c5f33cc94))
* surfaces ([99f9e96](https://github.com/motion-canvas/motion-canvas/commit/99f9e96a108bbd2a08a1931fd042a5969354da60))
* switch to monorepo ([6c8d190](https://github.com/motion-canvas/motion-canvas/commit/6c8d190c7d3d24bb4eac29eeb4b6d1abf370e160)), closes [#23](https://github.com/motion-canvas/motion-canvas/issues/23) [#86](https://github.com/motion-canvas/motion-canvas/issues/86) [#49](https://github.com/motion-canvas/motion-canvas/issues/49)
* switch to signals ([#64](https://github.com/motion-canvas/motion-canvas/issues/64)) ([d22d237](https://github.com/motion-canvas/motion-canvas/commit/d22d23728597e6fa82ea5c5a99a6c0a56819bded))
* switch to Vite ([#28](https://github.com/motion-canvas/motion-canvas/issues/28)) ([65b9133](https://github.com/motion-canvas/motion-canvas/commit/65b91337dbc47fe51cecc83657f79fab15343a0d)), closes [#141414](https://github.com/motion-canvas/motion-canvas/issues/141414) [#13](https://github.com/motion-canvas/motion-canvas/issues/13)
* threading ([e9f6b2a](https://github.com/motion-canvas/motion-canvas/commit/e9f6b2ad0838f0240e8bbd196061ba6ce23eac27))
* three.js integration ([79cc975](https://github.com/motion-canvas/motion-canvas/commit/79cc975ecaa35d54f0e530f9b732d6472d965c3a))
* time events ([f47cc66](https://github.com/motion-canvas/motion-canvas/commit/f47cc666f64ee5733ebe200503bd94a1a48a9c02))
* time events ([026a284](https://github.com/motion-canvas/motion-canvas/commit/026a2840a3625172431fb073a513fea4499164d4))
* time parameter for tweens ([3fe90ed](https://github.com/motion-canvas/motion-canvas/commit/3fe90edc49abb910522c75d4df3c56b40c29731f))
* timeline range ([ed2d78d](https://github.com/motion-canvas/motion-canvas/commit/ed2d78dbba4211aac5317035f7ce0931db90a59a))
* timeline tracks ([93a89cd](https://github.com/motion-canvas/motion-canvas/commit/93a89cd6edf055ac7847b508ee4364eb42a6bcd4))
* turn Layout into node ([#75](https://github.com/motion-canvas/motion-canvas/issues/75)) ([cdf8dc0](https://github.com/motion-canvas/motion-canvas/commit/cdf8dc0a35522482dee2dd78a69606b79f52246e))
* **ui:** timeline overhaul ([#47](https://github.com/motion-canvas/motion-canvas/issues/47)) ([4232a60](https://github.com/motion-canvas/motion-canvas/commit/4232a6072540b54451e99e18c1001db0175bb93f)), closes [#20](https://github.com/motion-canvas/motion-canvas/issues/20)
* **ui:** visual changes ([#96](https://github.com/motion-canvas/motion-canvas/issues/96)) ([3d599f4](https://github.com/motion-canvas/motion-canvas/commit/3d599f4e1788fbd15e996be8bf95679f1c6787bd))
* unify core types ([#71](https://github.com/motion-canvas/motion-canvas/issues/71)) ([9c5853d](https://github.com/motion-canvas/motion-canvas/commit/9c5853d8bc65204693c38109a25d1fefd44241b7))
* unify references and signals ([#137](https://github.com/motion-canvas/motion-canvas/issues/137)) ([063aede](https://github.com/motion-canvas/motion-canvas/commit/063aede0842f948d2c6704c6edd426e954bb4668))
* update core to 6.0.0 ([#17](https://github.com/motion-canvas/motion-canvas/issues/17)) ([f8d453b](https://github.com/motion-canvas/motion-canvas/commit/f8d453b22beb5250ea822d274ed2ab6bfea5c39c))
* use Web Audio API for waveform generation ([817e244](https://github.com/motion-canvas/motion-canvas/commit/817e244bb2187532df7142199917412ccfe8d218))
* use Web Audio API for waveform generation ([ba3e16f](https://github.com/motion-canvas/motion-canvas/commit/ba3e16f04a12de87408ca68df5acacf5610ed617))
* useAnimator utility ([ad32e8a](https://github.com/motion-canvas/motion-canvas/commit/ad32e8a0add494021d4c5c9fe5b3915189f00a08))
* viewport, playback, and timeline ([c5f9636](https://github.com/motion-canvas/motion-canvas/commit/c5f96360258a8dca5faa66c79451969da7eebabc))
* **vite-plugin:** improve audio handling ([#154](https://github.com/motion-canvas/motion-canvas/issues/154)) ([482f144](https://github.com/motion-canvas/motion-canvas/commit/482f14447ae54543346fab0f9e5b94631c5cfd4d))
* waveform data ([400a756](https://github.com/motion-canvas/motion-canvas/commit/400a756ebf7ee174d8cbaf03f1f74eddd1b75925))


### Reverts

* "ci(release): 9.1.3 [skip ci]" ([62953a6](https://github.com/motion-canvas/motion-canvas/commit/62953a6a8a1b1da3eb2e5f51c9fe60c716d6b94b))
* chore(release): 1.4.0 [skip ci] ([d6121ae](https://github.com/motion-canvas/motion-canvas/commit/d6121ae946e9e79e1e6ddee4b8b0dd839d122c55))
* ci(release): 1.0.1 [skip ci] ([#175](https://github.com/motion-canvas/motion-canvas/issues/175)) ([161a046](https://github.com/motion-canvas/motion-canvas/commit/161a04647ecdc8203daf2d887a6a44c79a92ee20))
* ci(release): 2.0.0 [skip ci] ([#176](https://github.com/motion-canvas/motion-canvas/issues/176)) ([551096b](https://github.com/motion-canvas/motion-canvas/commit/551096bf636a791ea7c7c1d38d8e03c360433008))


### BREAKING CHANGES

* remove legacy package
* change names of timing and interpolation functions

`TweenFunction` is now called `InterpolationFunction`.
Individual functions are now called `[type]Lerp` instead of `[type]Tween`.
For instance: `colorTween` is now `colorLerp`.

`InterpolationFunction` is now called `TimingFunction`.
This name is better aligned with the CSS spec.
* change to import paths

See [the migration guide](https://motion-canvas.github.io/guides/migration/12.0.0) for more info.
* change the way scenes are imported

Scene files no longer need to follow the pattern: `[name].scene.tsx`.
When importing scenes in the project file, a dedicated `?scene` query param should be used:
```ts
import example from './scenes/example?scene';

export default new Project({
  name: 'project',
  scenes: [example],
});
```
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
* Animator.inferTweenFunction now returns deepTween,
which does not work exactly as before, though should be a viable
replacement in most cases.
* `scene.transition()` has been replaced by `useTransition`

Any use of slide transition must be updated from
```ts
yield* scene.transition(slideTransition());
```
to
```ts
yield* slideTranstion();
```

Any transitions must be rewritten to utilize `useTransition`.
* Konva patches are not imported by default

Projects using `KonvaScene`s should import the patches manually at the very top of the file project:
```ts
import '@motion-canvas/core/lib/patches'
// ...
bootstrap(...);
```

`getset` import path has changed:
```ts
import {getset} from '@motion-canvas/core/lib/decorators/getset';
```
* change the type exported by scene files

Scene files need to export a special `SceneDescription` object instead of a simple generator function.
* change event naming convention

The names of all public events now use the following pattern: "on[WhatHappened]".
Example: "onValueChanged".
* change how images are imported

By default, importing images will now return their urls instead of a SpriteData object.
This behavior can be adjusted using the `?img` and `?anim` queries.
* change time events API
* `waitFor` and `waitUntil` were moved

They should be imported from `@motion-canvas/core/lib/flow`.
