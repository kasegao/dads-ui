import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbList, Breadcrumbs } from './Breadcrumbs';

const renderBreadcrumbs = () =>
  render(
    <Breadcrumbs aria-label='現在位置'>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='/'>ホーム</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink asChild={true}>
            <a href='/org'>組織情報</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrent={true}>お知らせ</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumbs>,
  );

test('renders a labelled navigation with links and the current page', async () => {
  const screen = await renderBreadcrumbs();

  await expect.element(screen.getByRole('navigation', { name: '現在位置' })).toBeVisible();
  await expect.element(screen.getByRole('link', { name: 'ホーム' })).toHaveAttribute('href', '/');
  await expect
    .element(screen.getByRole('link', { name: '組織情報' }))
    .toHaveAttribute('href', '/org');
  await expect.element(screen.getByText('お知らせ')).toHaveAttribute('aria-current', 'page');
});

test('applies the DADS link style to plain and asChild links', async () => {
  const screen = await renderBreadcrumbs();

  for (const name of ['ホーム', '組織情報']) {
    const style = getComputedStyle(screen.getByRole('link', { name }).element());
    expect(style.color).toBe('rgb(0, 17, 143)');
    expect(style.textDecorationLine).toBe('underline');
  }
});

test('renders a separator after every item except the current one', async () => {
  const screen = await renderBreadcrumbs();

  expect(screen.container.querySelectorAll('svg[aria-hidden="true"]').length).toBe(2);
  expect(screen.getByText('お知らせ').element().querySelector('svg')).toBeNull();
});
