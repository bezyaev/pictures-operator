import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import fs from 'fs-extra';
import path from 'path';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';

const copyWasmFiles = (sourceDir, destDir) => {
  return {
    name: 'copy-wasm-files',
    buildStart() {
      console.log('Copying .wasm and .js files...');
      const files = fs.readdirSync(sourceDir);
      files.forEach((file) => {
        if (file.endsWith('.wasm')) {
          const srcPath = path.join(sourceDir, file);
          const destPath = path.join(destDir, file);
          fs.copyFileSync(srcPath, destPath);
          console.log(`Copied: ${srcPath} to ${destPath}`);
        }

        if (file.endsWith('.js')) {
          const srcPath = path.join(sourceDir, file);
          const destPath = path.join(destDir, file);
          fs.copyFileSync(srcPath, destPath);
          console.log(`Copied: ${srcPath} to ${destPath}`);
        }
      });
      console.log('.wasm files copied.');
    }
  };
};

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
        inlineDynamicImports: true,
        format: 'es',
        sourcemap: false,
        plugins: []
      },
      {
        file: 'dist/index.umd.js',
        inlineDynamicImports: true,
        format: 'umd',
        name: 'ImageOperator',
        sourcemap: false
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      copyWasmFiles('node_modules/@jsquash/webp/codec/enc', 'dist'),
      copyWasmFiles('node_modules/@jsquash/webp/codec/dec', 'dist'),
      copyWasmFiles('node_modules/@jsquash/avif/codec/dec', 'dist'),
      copyWasmFiles('node_modules/@jsquash/avif/codec/enc', 'dist')
    ],
    external: ['tslib']
  }
];
