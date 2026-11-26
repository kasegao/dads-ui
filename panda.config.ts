import { defineConfig } from '@pandacss/dev';
import { dadsPreset } from './src/preset';

export default defineConfig({
  presets: ['@pandacss/preset-base', dadsPreset],
  preflight: true,
  include: ['./src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}'],
  exclude: [],
  outdir: 'styled-system',
  jsxFramework: 'react',
  prefix: 'dads',
});
