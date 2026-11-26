import type { Preview } from '@storybook/react-vite';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
    options: {
      storySort: { order: ['Foundations', 'Components'] },
    },
  },
};

export default preview;
