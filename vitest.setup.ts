import { beforeEach } from 'vitest';
import { userEvent } from 'vitest/browser';
import './src/styles/index.css';

// Tests share one real pointer. Park it in the bottom-right corner so that an element rendered
// under the previous pointer position does not start in its :hover state.
beforeEach(async () => {
  await userEvent.hover(document.documentElement, {
    position: { x: window.innerWidth - 1, y: window.innerHeight - 1 },
  });
});
