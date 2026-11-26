import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  core: { disableTelemetry: true },
  framework: { name: '@storybook/react-vite', options: {} },
  viteFinal: (config) => {
    // The library build options in vite.config.ts do not apply to Storybook.
    if (config.build) {
      config.build.lib = undefined;
      config.build.rollupOptions = undefined;
    }
    return config;
  },
};

export default config;
