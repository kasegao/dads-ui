import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  FormControlLabel,
  Label,
  Legend,
  RequirementBadge,
  StatusBadge,
  SupportText,
} from './FormControlLabel';

test('Label names its control and SupportText describes it', async () => {
  const screen = await render(
    <FormControlLabel data-testid='root'>
      <Label htmlFor='name'>
        氏名<RequirementBadge>※必須</RequirementBadge>
      </Label>
      <SupportText id='name-support'>姓と名の間は空けてください。</SupportText>
      <input id='name' aria-describedby='name-support' />
    </FormControlLabel>,
  );

  const input = screen.getByRole('textbox', { name: '氏名 ※必須' });
  await expect.element(input).toHaveAccessibleDescription('姓と名の間は空けてください。');

  const root = screen.getByTestId('root').element();
  expect(root.tagName).toBe('DIV');
  expect(getComputedStyle(root).display).toBe('flex');
  expect(getComputedStyle(root).flexDirection).toBe('column');
  expect(getComputedStyle(root).rowGap).toBe('8px');
});

test('as="fieldset" with Legend names the group', async () => {
  const screen = await render(
    <FormControlLabel as='fieldset' size='sm'>
      <Legend>連絡方法</Legend>
      <label>
        <input type='radio' name='contact' />
        メール
      </label>
    </FormControlLabel>,
  );

  const group = screen.getByRole('group', { name: '連絡方法' });
  await expect.element(group).toBeInTheDocument();
  expect(getComputedStyle(group.element()).rowGap).toBe('4px');
  expect(getComputedStyle(screen.getByText('連絡方法').element()).marginBottom).toBe('8px');
});

test('Label and Legend scale with size', async () => {
  const screen = await render(
    <>
      <Label size='sm'>小</Label>
      <Label>中</Label>
      <Label size='lg'>大</Label>
      <fieldset>
        <Legend size='lg'>凡例</Legend>
      </fieldset>
    </>,
  );
  const style = (text: string) => getComputedStyle(screen.getByText(text).element());

  expect(style('小').fontSize).toBe('16px');
  expect(style('中').fontSize).toBe('17px');
  expect(style('大').fontSize).toBe('18px');
  expect(style('凡例').fontSize).toBe('18px');
  expect(style('中').fontWeight).toBe('700');
  expect(style('中').color).toBe('rgb(51, 51, 51)');
});

test('badges and support text use their DADS colors', async () => {
  const screen = await render(
    <>
      <RequirementBadge>※必須</RequirementBadge>
      <RequirementBadge isOptional={true}>※任意</RequirementBadge>
      <StatusBadge>編集不可</StatusBadge>
      <SupportText>サポートテキスト</SupportText>
    </>,
  );
  const style = (text: string) => getComputedStyle(screen.getByText(text).element());

  expect(style('※必須').color).toBe('rgb(236, 0, 0)');
  expect(style('※任意').color).toBe('rgb(51, 51, 51)');
  expect(style('編集不可').backgroundColor).toBe('rgb(118, 118, 118)');
  expect(style('編集不可').color).toBe('rgb(255, 255, 255)');
  expect(style('サポートテキスト').color).toBe('rgb(102, 102, 102)');
});
