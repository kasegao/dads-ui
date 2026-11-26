import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Dd, Dl, Dt } from './Dl';

const renderDl = (marker?: 'none' | 'bullet') =>
  render(
    <Dl marker={marker}>
      <div>
        <Dt>用語</Dt>
        <Dd>説明</Dd>
      </div>
    </Dl>,
  );

test('exposes term and definition semantics', async () => {
  const screen = await renderDl();

  await expect.element(screen.getByRole('term')).toHaveTextContent('用語');
  await expect.element(screen.getByRole('definition')).toHaveTextContent('説明');
});

test('renders a bold term and an indented description', async () => {
  const screen = await renderDl();

  const term = getComputedStyle(screen.getByRole('term').element());
  const definition = getComputedStyle(screen.getByRole('definition').element());

  expect(term.fontWeight).toBe('700');
  expect(term.display).toBe('block');
  expect(term.marginLeft).toBe('0px');
  expect(definition.marginLeft).toBe('32px');
});

test('shows a disc marker on terms when marker is bullet', async () => {
  const screen = await renderDl('bullet');

  const term = getComputedStyle(screen.getByRole('term').element());

  expect(term.display).toBe('list-item');
  expect(term.listStyleType).toBe('disc');
  expect(term.marginLeft).toBe('32px');
});
