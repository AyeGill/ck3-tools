import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    globals: true,
    alias: {
      vscode: './src/test/mocks/vscode.ts',
    },
  },
});
