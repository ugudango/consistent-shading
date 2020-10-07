import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import minimist from 'minimist';
import typescript from '@rollup/plugin-typescript';
import pkg from '../package.json';

const argv = minimist(process.argv.slice(2));

const external = [
  'color-convert',
];

const baseConfig = {
  input: 'src/index.ts',
  external,
  plugins: {
    customResolver: nodeResolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
    }),
    replace: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  }
}

const buildFormats = [];
if(!argv.format || argv.format === 'es') {
  const esConfig = {
    ...baseConfig,
    output: {
      dir: 'dist/esm',
      format: 'esm',
      exports: 'named',
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      typescript({
        declaration: true,
        declarationDir: 'dist/esm/types/',
        rootDir: 'src/',
      }),
    ],
  };

  buildFormats.push(esConfig);
}

if (!argv.format || argv.format === 'cjs') {
  const umdConfig = {
    ...baseConfig,
    output: {
      compact: true,
      dir: 'dist/ssr',
      format: 'cjs',
      name: 'ConsistentShading',
      exports: 'auto',
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      typescript({
        declaration: true,
        declarationDir: 'dist/ssr/types/',
        rootDir: 'src/',
      }),
    ],
  };

  buildFormats.push(umdConfig);
}

if (!argv.format || argv.format === 'iife') {
  const unpkgConfig = {
    ...baseConfig,
    output: {
      compact: true,
      file: pkg.unpkg,
      format: 'iife',
      name: 'ConsistentShading',
      exports: 'auto',
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      typescript(),
      terser({
        output: {
          ecma: 5,
        },
      }),
    ],
  };

  buildFormats.push(unpkgConfig);
}

export default buildFormats;