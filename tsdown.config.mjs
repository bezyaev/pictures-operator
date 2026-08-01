import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'compressor.worker': 'src/workers/compressor.worker.ts',
    'heif.worker': 'src/workers/heif.worker.ts',
    'simple.worker': 'src/workers/simple.worker.ts'
  },
  outDir: 'dist',
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  dts: true,
  clean: true,
  hash: false,
  fixedExtension: false,
  deps: {
    alwaysBundle: [/^@jsquash\//],
    onlyBundle: [/^@jsquash\//, /^wasm-feature-detect$/]
  },
  copy: [
    {
      from: [
        'node_modules/@jsquash/webp/codec/enc/*.{js,wasm}',
        'node_modules/@jsquash/webp/codec/dec/*.{js,wasm}',
        'node_modules/@jsquash/avif/codec/enc/*.{js,wasm}',
        'node_modules/@jsquash/avif/codec/dec/*.{js,wasm}'
      ],
      flatten: true
    },
    {
      from: 'node_modules/libheif-js/libheif-wasm/libheif-bundle.mjs',
      flatten: true
    }
  ],
  report: true
});
