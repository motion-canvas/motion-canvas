# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [12.0.0-alpha.3](https://github.com/motion-canvas/motion-canvas/compare/v12.0.0-alpha.2...v12.0.0-alpha.3) (2022-12-05)


### Bug Fixes

* **2d:** switch iframes to ShadowDOM ([#90](https://github.com/motion-canvas/motion-canvas/issues/90)) ([86176be](https://github.com/motion-canvas/motion-canvas/commit/86176be055c08aba59272afcda00ed586f6c7ad6))


### Code Refactoring

* remove legacy package ([6a84120](https://github.com/motion-canvas/motion-canvas/commit/6a84120d949a32dff0ad413a9f359510ff109af1))


### Features

* **2d:** add methods for rearranging children ([#81](https://github.com/motion-canvas/motion-canvas/issues/81)) ([63f6c1a](https://github.com/motion-canvas/motion-canvas/commit/63f6c1aa51ac4ecd093151c8cd30910f2e72bcac))
* **2d:** improve property declarations ([27e7d26](https://github.com/motion-canvas/motion-canvas/commit/27e7d267ee91bf1e8ca79686b6ec31347f9f4d41))
* **2d:** simplify layout prop ([c24cb12](https://github.com/motion-canvas/motion-canvas/commit/c24cb12a22b7c85fdfb051917fa9ee1e0911717c))
* add advanced caching ([#69](https://github.com/motion-canvas/motion-canvas/issues/69)) ([2a644c9](https://github.com/motion-canvas/motion-canvas/commit/2a644c9315acfcc5280a5eacc9904df140a61e4f))
* add base class for shapes ([#67](https://github.com/motion-canvas/motion-canvas/issues/67)) ([d38c172](https://github.com/motion-canvas/motion-canvas/commit/d38c1724e129c553739cbfc27c4e5cd8f737f067))
* add basic logger ([#88](https://github.com/motion-canvas/motion-canvas/issues/88)) ([3d82e86](https://github.com/motion-canvas/motion-canvas/commit/3d82e863af3dc88b3709adbcd0b84e790d05c3b8)), closes [#17](https://github.com/motion-canvas/motion-canvas/issues/17)
* add basic transform to Node class ([#83](https://github.com/motion-canvas/motion-canvas/issues/83)) ([9e114c8](https://github.com/motion-canvas/motion-canvas/commit/9e114c8830a99c78e6a4fd9265b0e7552758af14))
* add cloning ([#80](https://github.com/motion-canvas/motion-canvas/issues/80)) ([47d7a0f](https://github.com/motion-canvas/motion-canvas/commit/47d7a0fa5da9a03d8ed91557db651f6f960e28b1))
* add CodeBlock component based on code-fns to 2D ([#78](https://github.com/motion-canvas/motion-canvas/issues/78)) ([ad346f1](https://github.com/motion-canvas/motion-canvas/commit/ad346f118d63b1e321ec315e1c70b925670124a1))
* add default renderer ([#63](https://github.com/motion-canvas/motion-canvas/issues/63)) ([9255490](https://github.com/motion-canvas/motion-canvas/commit/92554900965fe088538f5e703dbab2fd84f904d7)), closes [#56](https://github.com/motion-canvas/motion-canvas/issues/56) [#58](https://github.com/motion-canvas/motion-canvas/issues/58)
* add inspection ([#82](https://github.com/motion-canvas/motion-canvas/issues/82)) ([4d7f2ae](https://github.com/motion-canvas/motion-canvas/commit/4d7f2aee6daeda1a2146b632dfdc28b455295776))
* add missing layout props ([#72](https://github.com/motion-canvas/motion-canvas/issues/72)) ([f808a56](https://github.com/motion-canvas/motion-canvas/commit/f808a562b192fd03dba4b0d353284db344d6a80b))
* add polyline ([#84](https://github.com/motion-canvas/motion-canvas/issues/84)) ([4ceaf84](https://github.com/motion-canvas/motion-canvas/commit/4ceaf842915ac43d81f292c58a4dc73a8d1bb8e9))
* add Text and Image components ([#70](https://github.com/motion-canvas/motion-canvas/issues/70)) ([85c7dcd](https://github.com/motion-canvas/motion-canvas/commit/85c7dcdb4f8ca2f0bfb03950c85a8d6f6652fcdf))
* add video node ([#86](https://github.com/motion-canvas/motion-canvas/issues/86)) ([f4aa654](https://github.com/motion-canvas/motion-canvas/commit/f4aa65437a18cc85b00199f80cd5e04654c00c4b))
* implement absolute scale setter ([842079a](https://github.com/motion-canvas/motion-canvas/commit/842079a6547af4032719c85837df3db7c1c6d30a))
* introduce basic caching ([#68](https://github.com/motion-canvas/motion-canvas/issues/68)) ([6420d36](https://github.com/motion-canvas/motion-canvas/commit/6420d362d0e4ae058f55b6ff6bb2a3a32dec559b))
* minor improvements ([403c7c2](https://github.com/motion-canvas/motion-canvas/commit/403c7c27ad969880a14c498ec6cefb9e7e7b7544))
* minor improvements ([#77](https://github.com/motion-canvas/motion-canvas/issues/77)) ([7c6e584](https://github.com/motion-canvas/motion-canvas/commit/7c6e584aca353c9af55f0acb61b32b5f99727dba))
* new animator ([#91](https://github.com/motion-canvas/motion-canvas/issues/91)) ([d85f2f8](https://github.com/motion-canvas/motion-canvas/commit/d85f2f8a54c0f8bbfbc451884385f30e5b3ec206))
* signal error handling ([#89](https://github.com/motion-canvas/motion-canvas/issues/89)) ([472ac65](https://github.com/motion-canvas/motion-canvas/commit/472ac65938b804a6b698c8522ec0c3b6bdbcf1b1))
* simplify size access ([#65](https://github.com/motion-canvas/motion-canvas/issues/65)) ([3315e64](https://github.com/motion-canvas/motion-canvas/commit/3315e64641e9778bc48ea3fb707e3c0eeb581dfe))
* simplify size access further ([#66](https://github.com/motion-canvas/motion-canvas/issues/66)) ([9091a5e](https://github.com/motion-canvas/motion-canvas/commit/9091a5e05d8fadf72c50832c7c4467ac4424b72c))
* switch to signals ([#64](https://github.com/motion-canvas/motion-canvas/issues/64)) ([d22d237](https://github.com/motion-canvas/motion-canvas/commit/d22d23728597e6fa82ea5c5a99a6c0a56819bded))
* turn Layout into node ([#75](https://github.com/motion-canvas/motion-canvas/issues/75)) ([cdf8dc0](https://github.com/motion-canvas/motion-canvas/commit/cdf8dc0a35522482dee2dd78a69606b79f52246e))
* unify core types ([#71](https://github.com/motion-canvas/motion-canvas/issues/71)) ([9c5853d](https://github.com/motion-canvas/motion-canvas/commit/9c5853d8bc65204693c38109a25d1fefd44241b7))


### BREAKING CHANGES

* remove legacy package
