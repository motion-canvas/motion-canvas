import makeConfig from '@motion-canvas/internal/rollup/makeConfig.mjs';

export default makeConfig({
  plugins: [
    {
      resolveId(id) {
        if (id.startsWith('@motion-canvas/core')) {
          return {
            id: '@motion-canvas/core',
            external: true,
          };
        }
      },
    },
  ],
});
