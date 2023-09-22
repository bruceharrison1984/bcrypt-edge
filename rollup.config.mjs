import ts from 'rollup-plugin-ts';
import { defineConfig } from 'rollup';

const rollupOptions = defineConfig({
  input: 'src/bcrypt.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: false,
  },
  plugins: [
    ts({
      cwd: '.',
      transpiler: 'swc',
      swcConfig: {
        jsc: {
          minify: {
            compress: true,
            mangle: true,
          },
        },
        minify: true,
      },
    }),
  ],
});

export default rollupOptions;
