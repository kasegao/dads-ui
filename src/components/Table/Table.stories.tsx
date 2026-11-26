import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { css } from '../../../styled-system/css';
import { Link } from '../Link';
import { List } from '../List';
import {
  Table,
  TableActionButton,
  TableBody,
  type TableBorderSide,
  type TableBorderValue,
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

const meta = {
  title: 'Components/テーブル',
  component: TableContainer,
  tags: ['autodocs'],
} satisfies Meta<typeof TableContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkbox = css({
  width: '24',
  height: '24',
  accentColor: 'key.900',
  cursor: 'pointer',
});
const visuallyHidden = css({ srOnly: true });
const indentColumn = css({ width: '32' });
const wideTable = css({ minWidth: '40rem' });
const quarterColumn = css({ width: '25%' });
const mobileFrame = css({ maxWidth: '25rem', paddingInline: '16' });

const columns = ['1', '2', '3', '4', '5', '6'];
const rows = ['1', '2', '3'];

const HeaderRow = ({ label = 'ラベル' }: { label?: string }) => (
  <TableRow>
    {columns.map((column) => (
      <TableColHeader key={column}>{label}</TableColHeader>
    ))}
  </TableRow>
);

const DataRows = () =>
  rows.map((row) => (
    <TableRow key={row}>
      {columns.map((column) => (
        <TableCell key={column}>データ</TableCell>
      ))}
    </TableRow>
  ));

const sides: TableBorderSide[] = ['top', 'bottom', 'left', 'right'];
const borderValues: TableBorderValue[] = [
  ...sides,
  'hidden',
  'top-hidden',
  'bottom-hidden',
  'left-hidden',
  'right-hidden',
];

type PlaygroundArgs = {
  tableBorder: boolean;
  tableBorderValue: TableBorderValue[];
  tableCellBorder: boolean;
  tableCellBorderValue: TableBorderSide[];
  theadCellBorder: boolean;
  theadCellBorderValue: TableBorderSide[];
  tbodyCellBorder: boolean;
  tbodyCellBorderValue: TableBorderSide[];
  tdBorder: boolean;
  tdBorderValue: TableBorderValue[];
  dense: boolean;
  fullWidth: boolean;
  fixedWidth: boolean;
  rowStripe: boolean;
  hoverHighlight: boolean;
};

const toBorder = <T extends string>(enabled: boolean, values: T[]) => {
  if (!enabled) return undefined;
  return values.length > 0 ? values : true;
};

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    tableBorder: true,
    tableBorderValue: ['hidden'],
    tableCellBorder: true,
    tableCellBorderValue: [],
    theadCellBorder: false,
    theadCellBorderValue: [],
    tbodyCellBorder: false,
    tbodyCellBorderValue: [],
    tdBorder: false,
    tdBorderValue: [],
    dense: false,
    fullWidth: false,
    fixedWidth: false,
    rowStripe: false,
    hoverHighlight: false,
  },
  argTypes: {
    tableBorder: { name: 'Table border', control: 'boolean' },
    tableBorderValue: {
      name: 'Table border の値',
      if: { arg: 'tableBorder' },
      control: 'inline-check',
      options: ['hidden'],
    },
    tableCellBorder: { name: 'Table cellBorder', control: 'boolean' },
    tableCellBorderValue: {
      name: 'Table cellBorder の値',
      if: { arg: 'tableCellBorder' },
      control: 'inline-check',
      options: sides,
    },
    theadCellBorder: { name: 'TableHead cellBorder', control: 'boolean' },
    theadCellBorderValue: {
      name: 'TableHead cellBorder の値',
      if: { arg: 'theadCellBorder' },
      control: 'inline-check',
      options: sides,
    },
    tbodyCellBorder: { name: 'TableBody cellBorder', control: 'boolean' },
    tbodyCellBorderValue: {
      name: 'TableBody cellBorder の値',
      if: { arg: 'tbodyCellBorder' },
      control: 'inline-check',
      options: sides,
    },
    tdBorder: { name: 'TableCell border', control: 'boolean' },
    tdBorderValue: {
      name: 'TableCell border の値',
      if: { arg: 'tdBorder' },
      control: 'inline-check',
      options: borderValues,
    },
    dense: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    fixedWidth: { control: 'boolean', if: { arg: 'fullWidth' } },
    rowStripe: { control: 'boolean' },
    hoverHighlight: { control: 'boolean' },
  },
  render: (args) => (
    <TableContainer
      size={args.dense ? 'dense' : 'default'}
      rowStripe={args.rowStripe}
      rowHoverHighlight={args.hoverHighlight}
    >
      <Table
        border={toBorder(args.tableBorder, args.tableBorderValue)}
        cellBorder={toBorder(args.tableCellBorder, args.tableCellBorderValue)}
        width={args.fullWidth ? 'full' : undefined}
        layout={args.fullWidth && args.fixedWidth ? 'fixed' : undefined}
      >
        <TableHead cellBorder={toBorder(args.theadCellBorder, args.theadCellBorderValue)}>
          <TableRow>
            {columns.slice(0, 4).map((column) => (
              <TableColHeader key={column}>ラベル</TableColHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody cellBorder={toBorder(args.tbodyCellBorder, args.tbodyCellBorderValue)}>
          {['1', '2', '3', '4'].map((row) => (
            <TableRow key={row}>
              <TableCell>データ</TableCell>
              {row === '2' ? (
                <TableCell border={toBorder(args.tdBorder, args.tdBorderValue)}>
                  長いテキスト長いテキスト長いテキスト
                </TableCell>
              ) : (
                <TableCell>データ</TableCell>
              )}
              <TableCell>データ</TableCell>
              <TableCell>データ</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const Example: Story = {
  name: '基本的なマークアップ',
  render: () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableColHeader>コース名</TableColHeader>
            <TableColHeader>受講者数</TableColHeader>
            <TableColHeader>出席率</TableColHeader>
            <TableColHeader>平均点</TableColHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {[
            ['基礎コース', '150', '92%', '78'],
            ['応用コース', '120', '88%', '75'],
            ['専門コース', '90', '95%', '82'],
          ].map(([course, students, attendance, score]) => (
            <TableRow key={course}>
              <TableRowHeader>{course}</TableRowHeader>
              <TableCell>{students}</TableCell>
              <TableCell>{attendance}</TableCell>
              <TableCell>{score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const Plain: Story = {
  name: '見出しセルなし',
  render: () => (
    <TableContainer>
      <Table cellBorder='bottom'>
        <TableBody>
          <DataRows />
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const FirstRowAsHeaderCell: Story = {
  name: '1行目が見出しセル',
  render: () => (
    <TableContainer>
      <Table>
        <TableHead>
          <HeaderRow />
        </TableHead>
        <TableBody cellBorder='bottom'>
          <DataRows />
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const FirstColumnAsHeaderCell: Story = {
  name: '1列目が見出しセル',
  render: () => (
    <TableContainer>
      <Table cellBorder='right'>
        <TableBody>
          {['1', '2', '3', '4'].map((row) => (
            <TableRow key={row}>
              <TableRowHeader>ラベル</TableRowHeader>
              {columns.slice(1).map((column) => (
                <TableCell key={column}>データ</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const FirstRowAndColumnAsHeaderCell: Story = {
  name: '1行目と1列目の両方が見出しセル',
  render: () => (
    <TableContainer>
      <Table cellBorder='bottom'>
        <TableHead>
          <TableRow>
            <TableCell bg='solid-gray-100' border='right' />
            {columns.slice(1).map((column) => (
              <TableColHeader key={column}>ラベル</TableColHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row}>
              <TableRowHeader>ラベル</TableRowHeader>
              {columns.slice(1).map((column) => (
                <TableCell key={column}>データ</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const CondensedTable: Story = {
  name: 'データテーブル（高さの小さい行）',
  render: () => (
    <TableContainer size='dense'>
      <Table cellBorder='bottom'>
        <TableHead>
          <HeaderRow />
        </TableHead>
        <TableBody>
          <DataRows />
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const BorderOnRowAndColumn: Story = {
  name: '行と列の両方に罫線',
  render: () => (
    <TableContainer>
      <Table border='hidden' cellBorder={true}>
        <TableHead>
          <HeaderRow />
        </TableHead>
        <TableBody>
          <DataRows />
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const TableHeaderWithColspan: Story = {
  name: '列を結合した見出しセル',
  render: () => (
    <TableContainer>
      <Table border={true} cellBorder='bottom'>
        <TableHead cellBorder='right'>
          <TableRow>
            <TableColHeader colSpan={3}>親ラベル</TableColHeader>
            <TableColHeader colSpan={3}>親ラベル</TableColHeader>
          </TableRow>
          <HeaderRow label='子ラベル' />
        </TableHead>
        <TableBody>
          <DataRows />
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const TableHeaderWithRowspan: Story = {
  name: '行を結合した見出しセル',
  render: () => (
    <TableContainer>
      <Table border={true} cellBorder='bottom'>
        <TableBody>
          {['1', '2'].map((group) => [
            <TableRow key={`${group}-1`}>
              <TableRowHeader rowSpan={2} border='right'>
                親ラベル
              </TableRowHeader>
              <TableRowHeader>子ラベル</TableRowHeader>
              {columns.slice(2).map((column) => (
                <TableCell key={column}>データ</TableCell>
              ))}
            </TableRow>,
            <TableRow key={`${group}-2`}>
              <TableRowHeader>子ラベル</TableRowHeader>
              {columns.slice(2).map((column) => (
                <TableCell key={column}>データ</TableCell>
              ))}
            </TableRow>,
          ])}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const IndentedRows: Story = {
  name: 'インデントした行',
  render: () => (
    <TableContainer>
      <Table cellBorder='bottom'>
        <colgroup>
          <col className={indentColumn} />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableColHeader as='td' />
            <TableColHeader as='td' />
            <TableColHeader>代表者名</TableColHeader>
            <TableColHeader>電話番号</TableColHeader>
            <TableColHeader>住所</TableColHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <th scope='row' colSpan={2}>
              東京本社
            </th>
            <TableCell>山田太郎</TableCell>
            <TableCell>03-1234-5678</TableCell>
            <TableCell>東京都新宿区1-2-3</TableCell>
          </TableRow>
          {[
            ['営業部', '佐藤花子', '03-2345-6789', '東京都渋谷区4-5-6'],
            ['開発部', '鈴木一郎', '03-3456-7890', '東京都港区7-8-9'],
          ].map(([department, name, tel, address]) => (
            <TableRow key={department}>
              <th scope='row'>
                <span className={visuallyHidden}>東京本社</span>
              </th>
              <th scope='row'>{department}</th>
              <TableCell>{name}</TableCell>
              <TableCell>{tel}</TableCell>
              <TableCell>{address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const StripeTable: Story = {
  name: 'ストライプ',
  render: () => (
    <TableContainer rowStripe={true}>
      <Table cellBorder='bottom'>
        <TableHead>
          <HeaderRow />
        </TableHead>
        <TableBody>
          <DataRows />
          <DataRows />
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const HighlightHoveredRow: Story = {
  name: 'ホバーした行のハイライト',
  render: () => (
    <TableContainer rowStripe={true} rowHoverHighlight={true}>
      <Table cellBorder='bottom'>
        <TableHead>
          <HeaderRow />
        </TableHead>
        <TableBody>
          <DataRows />
          <DataRows />
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

const articles = [
  { id: 'selectable-table-title-1', title: '記事タイトル1', status: '公開中', comments: 10 },
  { id: 'selectable-table-title-2', title: '記事タイトル2', status: '下書き', comments: 0 },
  { id: 'selectable-table-title-3', title: '記事タイトル3', status: '非公開', comments: 3 },
];

export const SelectableTable: Story = {
  name: 'チェックボックスで行を選択',
  render: () => {
    const checkAll = useRef<HTMLInputElement>(null);
    const [checks, setChecks] = useState([false, true, false]);
    const allChecked = checks.every(Boolean);
    const noneChecked = checks.every((checked) => !checked);

    useEffect(() => {
      if (checkAll.current) {
        checkAll.current.indeterminate = !allChecked && !noneChecked;
      }
    }, [allChecked, noneChecked]);

    const handleChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      setChecks(checks.map((checked, i) => (i === index ? event.target.checked : checked)));
    };

    return (
      <TableContainer size='dense' selectable={true}>
        <Table cellBorder='bottom'>
          <TableHead>
            <TableRow>
              <TableColHeader>
                <label>
                  <input
                    ref={checkAll}
                    className={checkbox}
                    type='checkbox'
                    aria-label='行を選択'
                    aria-description='すべての行を選択する'
                    checked={allChecked}
                    onChange={() => setChecks(checks.map(() => !allChecked))}
                  />
                </label>
              </TableColHeader>
              <TableColHeader>タイトル</TableColHeader>
              <TableColHeader>状態</TableColHeader>
              <TableColHeader>コメント数</TableColHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article, index) => (
              <TableRow key={article.id}>
                <TableCell>
                  <label>
                    <input
                      className={checkbox}
                      type='checkbox'
                      aria-labelledby={article.id}
                      checked={checks[index]}
                      onChange={handleChange(index)}
                    />
                  </label>
                </TableCell>
                <TableCell id={article.id}>{article.title}</TableCell>
                <TableCell>{article.status}</TableCell>
                <TableCell>{article.comments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  },
};

const SortableTable = ({ dense }: { dense?: boolean }) => {
  const [sorted, setSorted] = useState<{ column: string; sort: TableSort }>({
    column: '2',
    sort: 'ascending',
  });

  const toggle = (column: string) => {
    setSorted({
      column,
      sort: sorted.column === column && sorted.sort === 'ascending' ? 'descending' : 'ascending',
    });
  };

  return (
    <TableContainer size={dense ? 'dense' : 'default'}>
      <Table border={true} cellBorder={true}>
        <TableHead>
          <TableRow>
            {columns.slice(0, 5).map((column) => (
              <TableSortHeader key={column} sort={sorted.column === column ? sorted.sort : 'none'}>
                <TableSortButton onClick={() => toggle(column)}>ラベル</TableSortButton>
                {column === '2' && (
                  <TableActionButton aria-label='列メニュー' aria-haspopup={true} />
                )}
              </TableSortHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row}>
              {columns.slice(0, 5).map((column) => (
                <TableCell key={column}>データ</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const SortableHeader: Story = {
  name: 'ソート機能つきの見出しセル',
  render: () => <SortableTable />,
};

export const SortableHeaderDense: Story = {
  name: 'ソート機能つきの見出しセル（データテーブル）',
  render: () => <SortableTable dense={true} />,
};

export const LinkedTextInCell: Story = {
  name: 'セル内のリンク',
  render: () => (
    <TableContainer>
      <Table width='full' layout='fixed' cellBorder='bottom'>
        <TableHead>
          <TableRow>
            <TableColHeader>ラベル</TableColHeader>
            <TableColHeader>ラベル</TableColHeader>
            <TableColHeader>ラベル</TableColHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Link href='#'>デジタル庁</Link>
            </TableCell>
            <TableCell>データ</TableCell>
            <TableCell>データ</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>データ</TableCell>
            <TableCell>データ</TableCell>
            <TableCell>データ</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <List spacing='4'>
                <li>
                  <Link href='#'>デジタル庁</Link>
                </li>
                <li>
                  <Link href='#'>デジタル庁デザインシステム</Link>
                </li>
              </List>
            </TableCell>
            <TableCell>データ</TableCell>
            <TableCell>データ</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const WithCaption: Story = {
  name: 'キャプションつき',
  render: () => (
    <TableContainer as='figure'>
      <TableCaption>表1: テーブルキャプション</TableCaption>
      <Table cellBorder='bottom'>
        <TableHead>
          <HeaderRow />
        </TableHead>
        <TableBody>
          <DataRows />
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const OverflowOnMobile: Story = {
  name: 'モバイルでの横スクロール',
  render: () => (
    <div className={mobileFrame}>
      <TableScrollShadow padding='1rem' role='region' aria-label='チャネルの一覧'>
        <TableContainer>
          <Table className={wideTable} cellBorder='bottom'>
            <TableHead>
              <TableRow>
                <TableColHeader className={quarterColumn}>項目</TableColHeader>
                <TableColHeader>例</TableColHeader>
                <TableColHeader>説明</TableColHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>チャネルの種類</TableCell>
                <TableCell>
                  オンラインポータル、電話サポート、メール窓口、情報パンフ、動画案内、SNSアカウント、イベント告知、FAQページ
                </TableCell>
                <TableCell>
                  市民は自分に適した手段で情報取得やサービス利用が可能で、行政も効果的なコミュニケーションとサポートを提供できます
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>プロバイダー</TableCell>
                <TableCell>光ファイバー、DSL、ケーブル、ワイヤレスなど</TableCell>
                <TableCell>
                  ユーザーは異なるプロバイダータイプから、自分のニーズに合った高速インターネット接続を選択できます
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>サービスを提供する地域</TableCell>
                <TableCell>
                  <List spacing='4'>
                    <li>りんご区</li>
                    <li>みかん区</li>
                    <li>ぶどう区</li>
                    <li>いちご区</li>
                    <li>なし区</li>
                  </List>
                </TableCell>
                <TableCell>
                  特有のニーズに応えながら、高品質かつ効率的なサポートを目指しています。地元のコミュニティと密接に連携し、信頼性とアクセシビリティを大切にしています。
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TableScrollShadow>
    </div>
  ),
};
