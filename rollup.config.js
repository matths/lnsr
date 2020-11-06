import builtins from 'builtin-modules';
import pkg from './package.json';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
 
export default {
  input: pkg.module,
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    }
  ],
  external: [
    ...builtins,
    ...Object.keys(pkg.dependencies || {})
  ],
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    commonjs()
  ]
};
