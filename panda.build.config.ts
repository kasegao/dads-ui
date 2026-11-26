import { defineConfig } from '@pandacss/dev';
import base from './panda.config';

/** Used for `dist/styles.css`: scans component sources only (no stories, tests or docs). */
export default defineConfig({
  ...base,
  include: ['./src/components/**/*.{ts,tsx}', './src/styles/**/*.ts', './src/utils/**/*.{ts,tsx}'],
  exclude: ['./src/**/*.stories.tsx', './src/**/*.test.{ts,tsx}'],
});
