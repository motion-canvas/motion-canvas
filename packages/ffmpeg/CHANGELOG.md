# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2026-09-15)

### Features

* **ffmpeg:** skip encoding when extracting frames ([#1095](https://github.com/motion-canvas/motion-canvas/issues/1095)) ([8b0d274](https://github.com/motion-canvas/motion-canvas/commit/8b0d27499c664272271ccc3fd45cbd4561768ea7))
* programmable sounds ([#1082](https://github.com/motion-canvas/motion-canvas/issues/1082)) ([a40d50b](https://github.com/motion-canvas/motion-canvas/commit/a40d50b87f5a2940e81d2fd0af4acb6d19202260))
* sound waveforms ([#1158](https://github.com/motion-canvas/motion-canvas/issues/1158)) ([158125a](https://github.com/motion-canvas/motion-canvas/commit/158125afa5642e342cd8c16173a698f13fe24651))


## Unreleased

### Build System

* upgrade `@types/fluent-ffmpeg` from `^2.1.21` to `^2.1.28`

  The typings for `server/FFmpegExporterServer.ts` move to the
  registry `latest`. 2.1.25 added typed `on()` event overloads
  (`start`, `progress`, `stderr`, `codecData`, `error`, `filenames`,
  `end`), 2.1.26 the `filenames` event, 2.1.27 a `codecData` fix, and
  2.1.28 `esModuleInterop`-compatible imports. The typed `end`
  listener signature required one adjustment: `this.command.on('end',
  resolve)` became `this.command.on('end', () => resolve())`, since
  the listener now receives `(stdout, stderr)` and `resolve` only
  accepts `void | PromiseLike<void>`. The runtime
  `fluent-ffmpeg@^2.1.3` is already latest and unchanged. Verified
  with the client + server `tsc` builds, the lerna build, the unit
  suites, eslint and prettier.

* upgrade `ffmpeg-ffprobe-static` from `^6.1.1-rc.5` to `^6.1.2-rc.1`

  The package that provides the exporter's bundled binaries
  (`import {ffmpegPath, ffprobePath} from 'ffmpeg-ffprobe-static'` in
  `server/FFmpegExporterServer.ts`, wired into
  `fluent-ffmpeg.setFfmpegPath` / `setFfprobePath`) moves to the
  registry `latest` dist-tag (uninstall first, then `npm add
  ffmpeg-ffprobe-static@latest -w packages/ffmpeg`, then `npm
  dedupe`).

  6.1.2-rc.1 bundles the `b6.1.2-rc.1` binaries — the installed
  linux-x64 build reports `ffmpeg version
  n6.1.2-9-g4571c80b40-20241023`, staying on the FFmpeg 6.1 line — and
  drops the `postinstall: patch-package` hook plus the
  `patch-package@^6.2.2` dependency (which the root `overrides` entry
  used to pin to 8.0.1; that override is now removed). The install
  script also downloads from `descriptinc/ffmpeg-ffprobe-static`
  again instead of the old personal fork, and `@derhuerst/http-basic`
  moves 8.2.0 → 8.2.4 (`concat-stream@^2.0.0`). The root
  `allowScripts` pin travels with the version
  (`ffmpeg-ffprobe-static@6.1.2-rc.1`) so `node install.js` still
  downloads the binaries under npm 11's install-scripts gate.

  Verified: client + server `tsc` builds, the full lerna build, the
  `core` / `2d` unit suites and e2e, plus an end-to-end
  `fluent-ffmpeg` smoke test using the package's own paths (lavfi →
  H.264 MP4, then `ffprobe` of the result).

* adopt Vite 8's ESM-only type declarations in the server build

  The workspace moved to `vite@8.3.0` (see the root CHANGELOG), and Vite
  8 ships ESM-only type declarations. The server `tsconfig` used
  `module: CommonJS` + `moduleResolution: node`, which cannot resolve
  them at all — `npm run server:build` failed with

  ```
  server/FFmpegBridge.ts(3,38): error TS2307: Cannot find module
  'vite' or its corresponding type declarations.
  ```

  Changes:

  - `server/tsconfig.json`: `module`/`moduleResolution`
    `CommonJS`/`node` -> `node16`/`node16`. Because the package has no
    `"type": "module"`, the emitted `lib/server` is still CommonJS —
    the declaration `Connect`/`ViteDevServer` types are the only
    reason the compiler has to resolve Vite.
  - `server/FFmpegBridge.ts`:
    `import type {Connect, ViteDevServer} from 'vite' with
    {'resolution-mode': 'import'}` — TS 5.4's import attribute for
    ESM types consumed from a CJS module (plain `import type` still
    raises TS1479 under `node16`).

  Upstream note: Vite 5 deprecated the CJS Node API and Vite 6 made the
  package ESM-only; the `node16` resolution mode is the migration Vite's
  own guide recommends. No runtime code, exports or the
  `@motion-canvas/vite-plugin` integration changed; the client build
  (`module: esnext`) is untouched.

  Verified: `npm run build -w packages/ffmpeg` (client + server `tsc`),
  the full `npx lerna run build`, the `core` / `2d` unit suites, e2e,
  and the `ffmpeg-ffprobe-static@6.1.2-rc.1` smoke path.

## [3.17.2](https://github.com/motion-canvas/motion-canvas/compare/v3.17.1...v3.17.2) (2024-12-14)

**Note:** Version bump only for package @motion-canvas/ffmpeg





# [3.17.0](https://github.com/motion-canvas/motion-canvas/compare/v3.16.0...v3.17.0) (2024-08-13)

**Note:** Version bump only for package @motion-canvas/ffmpeg





# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 1.1.0 (2023-05-10)

### Features

- initial commit
  ([7a01fd5](https://github.com/motion-canvas/exporters/commit/7a01fd5614f2d62b4bd6e24c1096706f5dbf218b))
