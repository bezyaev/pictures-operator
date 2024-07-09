import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';

export default [
  {
    input: 'src/workers/heif.worker.ts',
    output: {
      file: 'dist/heif.worker.js',
      format: 'iife',
      sourcemap: false,
      plugins: [],
      name: 'HeifWorker'
    },
    plugins: [
      resolve(),
      importMetaAssets(),
      commonjs(),
      nodePolyfills(),
      typescript({ tsconfig: './tsconfig.json' })
    ]
  },
  {
    input: 'src/workers/simple.worker.ts',
    output: {
      file: 'dist/simple.worker.js',
      format: 'iife',
      sourcemap: false,
      plugins: [],
      name: 'SimpleWorker'
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' })
    ]
  },
  {
    input: 'src/workers/compressor.worker.ts',
    output: {
      file: 'dist/compressor.worker.js',
      format: 'iife',
      sourcemap: false,
      plugins: [],
      name: 'CompressorWorker'
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' })
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.esm.js',
        format: 'es',
        sourcemap: false,
        plugins: [terser()]
      },
      {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'ImageOperator',
        sourcemap: false
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' })
    ],
    external: ['tslib']
  }
];
