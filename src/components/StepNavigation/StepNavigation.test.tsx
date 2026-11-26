import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  StepNavigation,
  StepNavigationDescription,
  StepNavigationList,
  StepNavigationNumber,
  StepNavigationStateIndicator,
  StepNavigationStep,
  StepNavigationStepHeader,
  StepNavigationTitle,
} from './StepNavigation';

const steps = (
  <StepNavigationList>
    <StepNavigationStep state='completed' first={true}>
      <StepNavigationStepHeader asChild={true}>
        <a href='#input'>
          <StepNavigationNumber data-testid='number-1'>
            1
            <StepNavigationStateIndicator state='completed' />
          </StepNavigationNumber>
          <StepNavigationTitle>入力</StepNavigationTitle>
        </a>
      </StepNavigationStepHeader>
      <StepNavigationDescription>必要事項を入力します。</StepNavigationDescription>
    </StepNavigationStep>
    <StepNavigationStep state='reached' aria-current='step'>
      <StepNavigationStepHeader>
        <StepNavigationNumber data-testid='number-2'>2</StepNavigationNumber>
        <StepNavigationTitle>確認</StepNavigationTitle>
      </StepNavigationStepHeader>
    </StepNavigationStep>
    <StepNavigationStep last={true}>
      <StepNavigationStepHeader asChild={true}>
        <button type='button' disabled={true}>
          <StepNavigationNumber data-testid='number-3'>3</StepNavigationNumber>
          <StepNavigationTitle>完了</StepNavigationTitle>
        </button>
      </StepNavigationStepHeader>
    </StepNavigationStep>
  </StepNavigationList>
);

test('exposes steps with hidden prefix, state text and current step', async () => {
  const screen = await render(
    <StepNavigation asChild={true}>
      <nav aria-label='申請の流れ'>{steps}</nav>
    </StepNavigation>,
  );

  await expect.element(screen.getByRole('navigation', { name: '申請の流れ' })).toBeVisible();
  expect(screen.getByRole('listitem').elements().length).toBe(3);

  await expect
    .element(screen.getByRole('link', { name: 'ステップ 1 完了 入力' }))
    .toHaveAttribute('href', '#input');

  const current = screen.getByRole('listitem').nth(1);
  await expect.element(current).toHaveAttribute('aria-current', 'step');
  await expect.element(current).toHaveTextContent('ステップ2確認');
  await expect.element(screen.getByRole('button', { name: /完了/ })).toBeDisabled();
});

test('only enabled link/button headers are marked interactive', async () => {
  const screen = await render(<StepNavigation>{steps}</StepNavigation>);

  const link = screen.getByRole('link').element();
  expect(link.hasAttribute('data-interactive')).toBe(true);
  expect(getComputedStyle(link).textDecorationLine).toBe('underline');
  expect(screen.getByRole('button').element().hasAttribute('data-interactive')).toBe(false);
});

test('number reflects size, state and current step', async () => {
  const screen = await render(<StepNavigation>{steps}</StepNavigation>);

  const completed = getComputedStyle(screen.getByTestId('number-1').element());
  expect(completed.height).toBe('44px');
  expect(completed.borderTopWidth).toBe('2px');
  expect(completed.backgroundColor).toBe('rgb(242, 242, 242)');

  const reached = getComputedStyle(screen.getByTestId('number-2').element());
  expect(reached.backgroundColor).toBe('rgb(51, 51, 51)');
  expect(reached.color).toBe('rgb(255, 255, 255)');
  expect(reached.outlineStyle).toBe('solid');
  expect(reached.outlineWidth).toBe('2px');

  const unreached = getComputedStyle(screen.getByTestId('number-3').element());
  expect(unreached.backgroundColor).toBe('rgb(255, 255, 255)');
  expect(unreached.outlineStyle).toBe('none');

  await screen.rerender(<StepNavigation size='small'>{steps}</StepNavigation>);
  const small = getComputedStyle(screen.getByTestId('number-1').element());
  expect(small.height).toBe('32px');
  expect(small.borderTopWidth).toBe('1px');
});

test('lays steps out by orientation and hides outer connectors', async () => {
  const screen = await render(
    <StepNavigation style={{ '--step-min-width': '240' } as React.CSSProperties}>
      {steps}
    </StepNavigation>,
  );

  const list = screen.getByRole('list').element();
  const [first, second, last] = screen.getByRole('listitem').elements();
  expect(getComputedStyle(list).flexDirection).toBe('row');
  expect(getComputedStyle(first).minWidth).toBe('240px');
  expect(getComputedStyle(first, '::before').display).toBe('none');
  expect(getComputedStyle(second, '::before').borderBottomWidth).toBe('1px');
  expect(getComputedStyle(last, '::after').display).toBe('none');

  await screen.rerender(<StepNavigation orientation='vertical'>{steps}</StepNavigation>);
  expect(getComputedStyle(list).flexDirection).toBe('column');
  expect(getComputedStyle(second, '::before').borderRightWidth).toBe('1px');
});

test('state indicator shows a visible label for editing and error', async () => {
  const screen = await render(
    <StepNavigation>
      <StepNavigationList>
        <StepNavigationStep state='editing' first={true}>
          <StepNavigationStepHeader>
            <StepNavigationNumber>
              1<StepNavigationStateIndicator state='editing' />
            </StepNavigationNumber>
          </StepNavigationStepHeader>
        </StepNavigationStep>
        <StepNavigationStep state='error'>
          <StepNavigationStepHeader>
            <StepNavigationNumber data-testid='error-number'>
              2<StepNavigationStateIndicator state='error' />
            </StepNavigationNumber>
          </StepNavigationStepHeader>
        </StepNavigationStep>
        <StepNavigationStep state='skipped' last={true}>
          <StepNavigationStepHeader>
            <StepNavigationNumber data-testid='skipped-number'>
              3<StepNavigationStateIndicator state='skipped' />
            </StepNavigationNumber>
          </StepNavigationStepHeader>
        </StepNavigationStep>
      </StepNavigationList>
    </StepNavigation>,
  );

  await expect.element(screen.getByText('編集中')).toBeVisible();
  await expect.element(screen.getByText('エラー')).toBeVisible();
  await expect.element(screen.getByText('スキップされました')).toBeInTheDocument();
  expect(getComputedStyle(screen.getByTestId('error-number').element()).color).toBe(
    'rgb(236, 0, 0)',
  );
  expect(getComputedStyle(screen.getByTestId('skipped-number').element()).borderTopStyle).toBe(
    'dashed',
  );
});
