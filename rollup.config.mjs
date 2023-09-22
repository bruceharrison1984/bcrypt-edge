import ts from 'rollup-plugin-ts';

export default [
  {
    input: 'src/bcrypt.ts',
    output: {
      dir: 'dist',
      format: 'esm',
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
  },
];
