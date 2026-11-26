import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../../styled-system/css';
import {
  EmergencyBanner,
  EmergencyBannerBody,
  EmergencyBannerButton,
  EmergencyBannerHeading,
  type EmergencyBannerHeadingLevel,
} from './EmergencyBanner';

type DemoArgs = {
  heading: string;
  level: EmergencyBannerHeadingLevel;
  buttonLabel: string;
  target?: '_self' | '_blank';
};

const meta: Meta<DemoArgs> = {
  title: 'Components/緊急時バナー',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '緊急時バナーは、すべてのユーザーが確実に認知できるよう、`body`要素や`main`要素内の先頭など、できるだけページの先頭に近い場所に配置してください。リンク先がある場合は`EmergencyBannerButton`を使います。',
      },
    },
  },
  argTypes: {
    level: { control: 'radio', options: ['h2', 'h3', 'h4', 'h5', 'h6'] },
    target: { control: 'radio', options: ['_self', '_blank'] },
  },
};

export default meta;
type Story = StoryObj<DemoArgs>;

const stack = css({ display: 'flex', flexDirection: 'column', gap: { base: '8', desktop: '16' } });
const date = css({ textStyle: 'std-16N-170' });
const text = css({ textStyle: { base: 'std-16N-170', desktop: 'std-20N-150' } });
const action = css({ marginTop: '16', marginBottom: '8' });

const Demo = ({ heading, level, buttonLabel, target }: DemoArgs) => (
  <EmergencyBanner>
    <EmergencyBannerHeading level={level}>{heading}</EmergencyBannerHeading>
    <EmergencyBannerBody>
      <div className={stack}>
        <p className={date}>
          <time dateTime='2024-01-01T06:00'>2024年1月1日 06:00更新</time>
        </p>
        <p className={text}>
          1時23分に○○地区に対して避難準備情報が発令されました。お年寄りの方等避難に時間がかかる方は、直ちに指定避難所へ避難してください。
        </p>
        {buttonLabel && (
          <EmergencyBannerButton className={action} href='#top' target={target}>
            {buttonLabel}
          </EmergencyBannerButton>
        )}
      </div>
    </EmergencyBannerBody>
  </EmergencyBanner>
);

const baseArgs: DemoArgs = {
  heading: '〇〇地区に避難準備情報が発令されました',
  level: 'h2',
  buttonLabel: '指定避難所を確認する',
  target: '_self',
};

export const Playground: Story = {
  args: baseArgs,
  render: (args) => <Demo {...args} />,
};

export const WithoutLink: Story = {
  name: 'リンクなし',
  args: { ...baseArgs, buttonLabel: '' },
  render: (args) => <Demo {...args} />,
};

export const WithLink: Story = {
  name: 'リンクあり',
  args: baseArgs,
  render: (args) => <Demo {...args} />,
};

export const WithLinkInNewWindow: Story = {
  name: '新規タブで開くリンク',
  args: { ...baseArgs, target: '_blank' },
  render: (args) => <Demo {...args} />,
};
