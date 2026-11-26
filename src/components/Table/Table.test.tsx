import { useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  Table,
  TableActionButton,
  TableBody,
  TableCaption,
  TableCell,
  TableColHeader,
  TableContainer,
  TableHead,
  TableRow,
  TableRowHeader,
  TableScrollShadow,
  type TableSort,
  TableSortButton,
  TableSortHeader,
} from './Table';

const styleOf = (element: Element) => getComputedStyle(element);

const gray420 = 'rgb(148, 148, 148)';
const gray500 = 'rgb(127, 127, 127)';
const black = 'rgb(0, 0, 0)';

test('exposes table semantics with scoped header cells', async () => {
  const screen = await render(
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableColHeader>コース名</TableColHeader>
            <TableColHeader>受講者数</TableColHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableRowHeader>基礎コース</TableRowHeader>
            <TableCell>150</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>,
  );

  await expect.element(screen.getByRole('table')).toBeVisible();
  const colHeader = screen.getByRole('columnheader', { name: 'コース名' });
  const rowHeader = screen.getByRole('rowheader', { name: '基礎コース' });
  await expect.element(colHeader).toHaveAttribute('scope', 'col');
  await expect.element(rowHeader).toHaveAttribute('scope', 'row');
  await expect.element(screen.getByRole('cell', { name: '150' })).toBeVisible();

  const colStyle = styleOf(colHeader.element());
  expect(colStyle.backgroundColor).toBe('rgb(230, 230, 230)');
  expect(colStyle.color).toBe('rgb(26, 26, 26)');
  expect(colStyle.fontWeight).toBe('700');
  expect(colStyle.textAlign).toBe('left');
  expect(colStyle.paddingTop).toBe('20px');
  expect(colStyle.paddingLeft).toBe('16px');
  expect(colStyle.borderBottomWidth).toBe('1px');
  expect(colStyle.borderBottomColor).toBe(black);

  const rowStyle = styleOf(rowHeader.element());
  expect(rowStyle.backgroundColor).toBe('rgb(230, 230, 230)');
  expect(rowStyle.borderRightWidth).toBe('1px');
  expect(rowStyle.borderRightColor).toBe(black);

  const cellStyle = styleOf(screen.getByRole('cell', { name: '150' }).element());
  expect(cellStyle.paddingTop).toBe('20px');
  expect(cellStyle.borderBottomWidth).toBe('0px');
  expect(cellStyle.lineHeight).toBe('27.2px');
});

test('cellBorder draws cell borders and the header keeps its black rule', async () => {
  const screen = await render(
    <TableContainer size='dense'>
      <Table cellBorder='bottom'>
        <TableHead>
          <TableRow>
            <TableColHeader>ラベル</TableColHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>データ</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>,
  );

  const cell = styleOf(screen.getByRole('cell').element());
  expect(cell.borderBottomWidth).toBe('1px');
  expect(cell.borderBottomStyle).toBe('solid');
  expect(cell.borderBottomColor).toBe(gray420);
  expect(cell.borderRightWidth).toBe('0px');
  expect(cell.paddingTop).toBe('12px');
  expect(cell.lineHeight).toBe('20.8px');

  expect(styleOf(screen.getByRole('columnheader').element()).borderBottomColor).toBe(black);
});

test('border props map to the table, sections and single cells', async () => {
  const screen = await render(
    <TableContainer>
      <Table border='hidden' cellBorder={true}>
        <TableBody>
          <TableRow>
            <TableCell>A</TableCell>
            <TableCell border={['top-hidden', 'left-hidden']} bg='solid-gray-50'>
              B
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>,
  );

  expect(styleOf(screen.getByRole('table').element()).borderTopStyle).toBe('hidden');

  const a = styleOf(screen.getByRole('cell', { name: 'A' }).element());
  expect(a.borderRightStyle).toBe('solid');
  expect(a.borderBottomColor).toBe(gray420);

  const b = styleOf(screen.getByRole('cell', { name: 'B' }).element());
  expect(b.borderTopStyle).toBe('hidden');
  expect(b.borderLeftStyle).toBe('hidden');
  expect(b.borderBottomStyle).toBe('solid');
  expect(b.borderBottomColor).toBe(gray500);
  expect(b.backgroundColor).toBe('rgb(242, 242, 242)');
});

test('rowStripe tints even rows and selectable highlights checked rows', async () => {
  const screen = await render(
    <TableContainer rowStripe={true} selectable={true}>
      <Table width='full' layout='fixed'>
        <TableBody>
          <TableRow data-testid='row-1'>
            <TableCell>
              <label>
                <input type='checkbox' aria-label='1行目を選択' />
              </label>
            </TableCell>
            <TableCell>1行目</TableCell>
          </TableRow>
          <TableRow data-testid='row-2'>
            <TableCell>2行目</TableCell>
            <TableCell>データ</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>,
  );

  expect(styleOf(screen.getByRole('table').element()).tableLayout).toBe('fixed');
  expect(styleOf(screen.getByTestId('row-1').element()).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(styleOf(screen.getByTestId('row-2').element()).backgroundColor).toBe('rgb(242, 242, 242)');

  const checkboxCell = screen.getByRole('checkbox').element().closest('td') as HTMLElement;
  expect(styleOf(checkboxCell).paddingTop).toBe('0px');
  expect(styleOf(checkboxCell).width).toBe('40px');

  const cell = screen.getByRole('cell', { name: '1行目', exact: true }).element();
  expect(styleOf(cell).backgroundColor).toBe('rgba(0, 0, 0, 0)');

  await screen.getByRole('checkbox').click();

  expect(styleOf(cell).backgroundColor).toBe('rgb(217, 230, 255)');
});

test('renders a caption inside a figure', async () => {
  const screen = await render(
    <TableContainer as='figure'>
      <TableCaption>表1: 参加者統計</TableCaption>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>データ</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>,
  );

  await expect.element(screen.getByRole('figure', { name: '表1: 参加者統計' })).toBeVisible();
  const caption = styleOf(screen.getByText('表1: 参加者統計').element());
  expect(caption.fontSize).toBe('17px');
  expect(caption.fontWeight).toBe('700');
});

const SortableTable = ({ onMenu }: { onMenu: () => void }) => {
  const [sort, setSort] = useState<TableSort>('none');

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableSortHeader sort={sort}>
              <TableSortButton
                onClick={() => setSort(sort === 'ascending' ? 'descending' : 'ascending')}
              >
                名前
              </TableSortButton>
              <TableActionButton aria-label='列メニュー' aria-haspopup={true} onClick={onMenu} />
            </TableSortHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>データ</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

test('sort header exposes aria-sort and switches its icon', async () => {
  const onMenu = vi.fn();
  const screen = await render(<SortableTable onMenu={onMenu} />);

  const header = screen.getByRole('columnheader');
  const button = screen.getByRole('button', { name: '名前' });
  const visiblePaths = () =>
    [...button.element().querySelectorAll('path')].map((path) => styleOf(path).display !== 'none');

  await expect.element(header).toHaveAttribute('aria-sort', 'none');
  expect(visiblePaths()).toEqual([true, false, false]);
  expect(styleOf(header.element()).paddingTop).toBe('12px');
  expect(styleOf(header.element()).borderBottomColor).toBe(black);
  expect(styleOf(button.element()).textDecorationLine).toBe('underline');

  await button.click();
  await expect.element(header).toHaveAttribute('aria-sort', 'ascending');
  expect(visiblePaths()).toEqual([false, true, false]);

  await userEvent.keyboard('{Enter}');
  await expect.element(header).toHaveAttribute('aria-sort', 'descending');
  expect(visiblePaths()).toEqual([false, false, true]);

  const menu = screen.getByRole('button', { name: '列メニュー' });
  expect(styleOf(menu.element()).width).toBe('44px');
  await menu.click();
  expect(onMenu).toHaveBeenCalledOnce();
});

test('scroll shadow appears on the sides that can be scrolled to', async () => {
  const screen = await render(
    <div style={{ width: '300px' }}>
      <TableScrollShadow data-testid='scroll' aria-label='表' role='region'>
        <TableContainer>
          <Table style={{ minWidth: '600px' }}>
            <TableBody>
              <TableRow>
                <TableCell>データ</TableCell>
                <TableCell>データ</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TableScrollShadow>
    </div>,
  );

  const scroll = screen.getByTestId('scroll');
  const element = scroll.element() as HTMLElement;
  const left = element.firstElementChild as HTMLElement;
  const right = element.lastElementChild as HTMLElement;

  await expect.element(scroll).toHaveAttribute('tabindex', '0');
  expect(styleOf(element).overflowX).toBe('auto');
  await expect.poll(() => right.hasAttribute('data-visible')).toBe(true);
  expect(left.hasAttribute('data-visible')).toBe(false);

  element.scrollLeft = 150;
  await expect.poll(() => left.hasAttribute('data-visible')).toBe(true);
  expect(right.hasAttribute('data-visible')).toBe(true);

  element.scrollLeft = element.scrollWidth;
  await expect.poll(() => right.hasAttribute('data-visible')).toBe(false);
  expect(left.hasAttribute('data-visible')).toBe(true);
});
