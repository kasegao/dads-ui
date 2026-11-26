import pandacss from '@pandacss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [pandacss(), react()],
  optimizeDeps: {
    include: [
      '@ark-ui/react/carousel',
      '@ark-ui/react/date-picker',
      '@ark-ui/react/file-upload',
      '@ark-ui/react/menu',
      '@ark-ui/react/tabs',
    ],
  },
  build: {
    lib: {
      entry: { index: 'src/index.ts', preset: 'src/preset/index.ts' },
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@ark-ui\/react($|\/)/],
    },
    sourcemap: true,
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
  },
});
