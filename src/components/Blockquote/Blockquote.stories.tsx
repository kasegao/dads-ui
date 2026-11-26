import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../../styled-system/css';
import { List } from '../List';
import { Blockquote } from './Blockquote';

const meta = {
  title: 'Components/引用ブロック',
  component: Blockquote,
  tags: ['autodocs'],
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

const paragraph = css({ marginBlock: '16' });

export const Playground: Story = {
  args: {
    children:
      'これは引用文の例です。デジタル庁デザインシステムでは、アクセシビリティファーストの原則に基づいて、すべてのユーザーが利用しやすいサービスの提供を目指しています。',
  },
};

export const MultipleParagraphs: Story = {
  name: '複数の段落',
  render: () => (
    <Blockquote>
      <p className={paragraph}>
        これは引用文の例です。デジタル庁デザインシステムでは、アクセシビリティファーストの原則に基づいて、すべてのユーザーが利用しやすいサービスの提供を目指しています。
      </p>
      <p className={paragraph}>これは複数の段落を含めている例です。</p>
      <p className={paragraph}>最初と最後の段落のマージンは自動的に調整されます。</p>
    </Blockquote>
  ),
};

export const WithList: Story = {
  name: 'リストを含む',
  render: () => (
    <Blockquote>
      <p className={paragraph}>
        デジタル庁デザインシステムは、以下の理念を追求して作成されています。
      </p>
      <List spacing='4'>
        <li>アクセシビリティファースト</li>
        <li>行政機関にとって高い汎用性と利便性</li>
        <li>継続的かつ持続可能な改善活動および研究と実践</li>
      </List>
      <p className={paragraph}>
        これにより、デジタル化の恩恵をすべての人に届けられる日本のデジタル化社会の構築に寄与します。
      </p>
    </Blockquote>
  ),
};
