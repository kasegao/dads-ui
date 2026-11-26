import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../../styled-system/css';
import { Link } from '../Link';
import { List } from './List';

const meta = {
  title: 'Components/箇条書きリスト',
  component: List,
  tags: ['autodocs'],
  argTypes: {
    spacing: { control: 'radio', options: ['4', '8', '12'] },
    marker: { control: 'radio', options: [undefined, 'number'] },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = css({ display: 'flex', flexDirection: 'column', gap: '32' });
const row = css({ display: 'flex', flexWrap: 'wrap', gap: '40' });

export const Playground: Story = {
  args: { spacing: '4' },
  render: (args) => (
    <List {...args}>
      <li>短いテキスト</li>
      <li>
        これは少し長めのテキストサンプルです。リストアイテムの中に含まれる文章の例として使用しています。
      </li>
      <li>リストアイテム</li>
    </List>
  ),
};

export const Numbered: Story = {
  name: '番号付きリスト',
  args: { spacing: '4', marker: 'number' },
  render: (args) => (
    <List {...args}>
      <li>
        <span>１　</span>
        最初
      </li>
      <li>
        <span>２　</span>
        二番目の項目として、長めの文章を含む例です。番号付きリストの中での文章の長さの違いを示しています。
      </li>
      <li>
        <Link href='#'>
          <span>３　</span>
          リンクになっている項目
        </Link>
      </li>
      <li>
        <span>４　</span>
        <Link href='#'>文中にリンクがある項目</Link>
        （長めの説明付き）
      </li>
    </List>
  ),
};

export const Spacing: Story = {
  name: '項目の間隔',
  args: { spacing: '4' },
  render: () => (
    <div className={row}>
      {(['4', '8', '12'] as const).map((spacing) => (
        <List key={spacing} spacing={spacing}>
          <li>間隔 {spacing}</li>
          <li>リストアイテム</li>
          <li>
            ネストされたリスト
            <List spacing={spacing}>
              <li>サブリストA</li>
              <li>サブリストB</li>
            </List>
          </li>
          <li>リストアイテム</li>
        </List>
      ))}
    </div>
  ),
};

export const Nested: Story = {
  name: '入れ子のリスト',
  args: { spacing: '4' },
  render: (args) => (
    <div className={column}>
      <List spacing={args.spacing}>
        <li>短いテキスト</li>
        <li>
          ネストされたリスト
          <List marker='number' spacing={args.spacing}>
            <li>
              <span>1. </span>
              番号付きリストの最初の項目
            </li>
            <li>
              <Link href='#'>
                <span>2. </span>
                二番目の項目で、これは比較的長い説明文を含んでいます。ネストされた構造の例として作成されました。
              </Link>
            </li>
            <li>
              <Link href='#'>
                <span>3. </span>
                三番目
              </Link>
            </li>
          </List>
        </li>
        <li>
          複雑な入れ子構造の例
          <List spacing={args.spacing}>
            <li>サブリストA</li>
            <li>
              サブリストBで更にネスト
              <List marker='number' spacing={args.spacing}>
                <li>
                  <span>①　</span>
                  番号付きサブアイテム1
                </li>
                <li>
                  <span>②　</span>
                  <Link href='#'>番号付きサブアイテム2</Link>
                  （長めの説明付き：この項目は複数レベルの入れ子構造を示すために作成されています）
                </li>
              </List>
            </li>
            <li>サブリストC</li>
          </List>
        </li>
      </List>

      <List marker='number' spacing={args.spacing}>
        <li>
          <span>１　</span>
          最初
        </li>
        <li>
          <span>２　</span>
          二番目（ネスト含む）
          <List spacing={args.spacing}>
            <li>無順序サブリスト項目A</li>
            <li>
              無順序サブリスト項目B
              <List marker='number' spacing={args.spacing}>
                <li>
                  <span>（１）</span>
                  再び番号付きリスト
                </li>
                <li>
                  <span>（２）</span>
                  非常に長いテキストの例：この項目は
                  <b>複数レベルの入れ子構造</b>
                  における文章の長さの違いを示すために作成されたサンプルテキストです。
                </li>
              </List>
            </li>
          </List>
        </li>
        <li>
          <span>３　</span>三番目
        </li>
      </List>
    </div>
  ),
};
