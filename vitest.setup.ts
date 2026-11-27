import { beforeEach } from 'vitest';
import { userEvent } from 'vitest/browser';
import './src/styles/index.css';

// Tests share one real pointer. Park it on a marker in the bottom-left corner so that an element
// rendered under the previous pointer position does not start in its :hover state. A fixed-position
// marker is used because a viewport coordinate can land on a classic (non-overlay) scrollbar,
// where the hover never succeeds.
const pointerPark = document.createElement('div');
pointerPark.setAttribute('aria-hidden', 'true');
pointerPark.style.cssText =
  'position:fixed;left:0;bottom:0;width:4px;height:4px;z-index:2147483647';

beforeEach(async () => {
  if (!pointerPark.isConnected) document.documentElement.append(pointerPark);
  // `force` skips the hit-target check: a modal dialog left open by the previous test covers the
  // marker until that test's tree is unmounted.
  await userEvent.hover(pointerPark, { force: true });
});
