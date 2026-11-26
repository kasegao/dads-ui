import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../../styled-system/css';
import { List } from '../List';
import { Disclosure, DisclosureBackLink, DisclosureSummary } from './Disclosure';

const meta = {
  title: 'Components/ディスクロージャー',
  component: Disclosure,
  tags: ['autodocs'],
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

const content = css({ marginBlock: '16', paddingLeft: '32' });
const stack = css({ display: 'flex', flexDirection: 'column', gap: '16' });
const backLink = css({ marginTop: '16' });
const narrow = css({ width: '16rem' });

const items = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const Playground: Story = {
  args: { open: false },
  render: (args) => (
    <Disclosure {...args}>
      <DisclosureSummary id='disclosure-playground'>ディスクロージャータイトル</DisclosureSummary>
      <div className={content}>
        これはダミーテキストです。ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。ダミーテキストを使用すると、デザインの全体像を評価したり、テキストの配置や長さを確認したりすることができます。ダミーテキストは実際の文章ではないので、内容には意味がありません。
        <DisclosureBackLink className={backLink} href='#disclosure-playground'>
          「ディスクロージャータイトル」の先頭に戻る
        </DisclosureBackLink>
      </div>
    </Disclosure>
  ),
};

export const Open: Story = {
  name: '開いた状態',
  render: () => (
    <Disclosure open={true}>
      <DisclosureSummary>ディスクロージャータイトル</DisclosureSummary>
      <div className={content}>
        これはダミーテキストです。ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。
      </div>
    </Disclosure>
  ),
};

export const WithLongContent: Story = {
  name: '長いコンテンツ',
  render: () => (
    <Disclosure>
      <DisclosureSummary id='disclosure-with-long-content'>
        ディスクロージャータイトル
      </DisclosureSummary>
      <div className={content}>
        <div className={stack}>
          <p>
            これはダミーテキストです。ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。ダミーテキストを使用すると、デザインの全体像を評価したり、テキストの配置や長さを確認したりすることができます。
          </p>
          <List spacing='4'>
            {items.map((item) => (
              <li key={item}>リストアイテム</li>
            ))}
          </List>
          <p>
            これはダミーテキストです。ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。ダミーテキストを使用すると、デザインの全体像を評価したり、テキストの配置や長さを確認したりすることができます。
          </p>
          <List spacing='4'>
            {items.map((item) => (
              <li key={item}>リストアイテム</li>
            ))}
          </List>
        </div>
        <DisclosureBackLink className={backLink} href='#disclosure-with-long-content'>
          「ディスクロージャータイトル」の先頭に戻る
        </DisclosureBackLink>
      </div>
    </Disclosure>
  ),
};

export const MultipleLineTitle: Story = {
  name: '複数行のタイトル',
  render: () => (
    <Disclosure className={narrow}>
      <DisclosureSummary id='disclosure-multiple-line-title'>
        複数行にまたがるディスクロージャータイトル
      </DisclosureSummary>
      <div className={content}>
        <List spacing='4'>
          {items.slice(0, 5).map((item) => (
            <li key={item}>リストアイテム</li>
          ))}
        </List>
        <DisclosureBackLink className={backLink} href='#disclosure-multiple-line-title'>
          「複数行にまたがるディスクロージャータイトル」の先頭に戻る
        </DisclosureBackLink>
      </div>
    </Disclosure>
  ),
};
