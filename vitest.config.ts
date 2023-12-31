import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'json-summary'],
    },
    globals: true,
    environment: 'miniflare',
    include: ['./test/**/*.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
