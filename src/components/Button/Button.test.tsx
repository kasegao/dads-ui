import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Button } from './Button';

test('renders a button and handles click', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <Button variant='solid-fill' size='lg' onClick={onClick}>
      送信
    </Button>,
  );

  const button = screen.getByRole('button', { name: '送信' });
  await button.click();

  expect(onClick).toHaveBeenCalledOnce();
  await expect.element(button).toHaveAttribute('type', 'button');
});

test('applies the DADS key color to solid-fill', async () => {
  const screen = await render(
    <Button variant='solid-fill' size='lg'>
      送信
    </Button>,
  );

  const element = screen.getByRole('button').element();
  expect(getComputedStyle(element).backgroundColor).toBe('rgb(0, 23, 193)');
  expect(getComputedStyle(element).minHeight).toBe('56px');
});

test('does not fire click when aria-disabled', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <Button variant='solid-fill' size='lg' aria-disabled={true} onClick={onClick}>
      送信
    </Button>,
  );

  await screen.getByRole('button').click({ force: true });

  expect(onClick).not.toHaveBeenCalled();
});

test('asChild renders the child element with button styles', async () => {
  const screen = await render(
    <Button asChild={true} variant='outline' size='md'>
      <a href='/next'>次へ</a>
    </Button>,
  );

  const link = screen.getByRole('link', { name: '次へ' });
  await expect.element(link).toHaveAttribute('href', '/next');
  expect(getComputedStyle(link.element()).minHeight).toBe('48px');
});

test('styles the native disabled attribute like aria-disabled', async () => {
  const screen = await render(
    <Button variant='solid-fill' size='lg' disabled={true}>
      送信
    </Button>,
  );

  const element = screen.getByRole('button').element();
  expect(getComputedStyle(element).backgroundColor).toBe('rgb(179, 179, 179)');
  expect(getComputedStyle(element).pointerEvents).toBe('none');
});
