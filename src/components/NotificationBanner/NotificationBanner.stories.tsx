import type { Meta, StoryObj } from '@storybook/react-vite';
import { css, cva, cx } from '../../../styled-system/css';
import { Button } from '../Button';
import {
  NotificationBanner,
  NotificationBannerBody,
  NotificationBannerClose,
  NotificationBannerMobileClose,
  type NotificationBannerStyle,
  type NotificationBannerType,
} from './NotificationBanner';

const meta = {
  title: 'Components/ノティフィケーションバナー',
  component: NotificationBanner,
  tags: ['autodocs'],
  argTypes: {
    bannerStyle: {
      control: 'radio',
      options: ['standard', 'color-chip'],
      description: 'ノティフィケーションバナーのスタイルを選択します。',
    },
    type: {
      control: 'radio',
      options: ['info1', 'info2', 'warning', 'error', 'success'],
      description: 'ノティフィケーションバナーで通知する情報属性の種類を選択します。',
    },
    headingLevel: { control: 'radio', options: [undefined, 'h2', 'h3', 'h4', 'h5', 'h6'] },
  },
} satisfies Meta<typeof NotificationBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = css({ display: 'flex', flexDirection: 'column', gap: '32' });

/** Re-points the key color scale used by `Button` to the banner's type color. */
const actions = cva({
  base: {
    display: 'grid',
    marginTop: '8',
    gap: { base: '8', desktop: '16' },
    gridAutoFlow: { desktop: 'column' },
    justifyContent: { desktop: 'flex-end' },
  },
  variants: {
    type: {
      info1: {},
      info2: {
        '--dads-colors-key-200': '{colors.solid-gray.200}',
        '--dads-colors-key-300': '{colors.solid-gray.300}',
        '--dads-colors-key-900': '{colors.solid-gray.800}',
        '--dads-colors-key-1000': '{colors.solid-gray.900}',
        '--dads-colors-key-1200': '{colors.black}',
      },
      warning: {
        '--dads-colors-key-200': '{colors.yellow.200}',
        '--dads-colors-key-300': '{colors.yellow.300}',
        '--dads-colors-key-900': '{colors.warning-yellow.2}',
        '--dads-colors-key-1000': '{colors.yellow.1000}',
        '--dads-colors-key-1200': '{colors.yellow.1200}',
      },
      error: {
        '--dads-colors-key-200': '{colors.red.200}',
        '--dads-colors-key-300': '{colors.red.300}',
        '--dads-colors-key-900': '{colors.error.1}',
        '--dads-colors-key-1000': '{colors.red.1000}',
        '--dads-colors-key-1200': '{colors.red.1200}',
      },
      success: {
        '--dads-colors-key-200': '{colors.green.200}',
        '--dads-colors-key-300': '{colors.green.300}',
        '--dads-colors-key-900': '{colors.success.2}',
        '--dads-colors-key-1000': '{colors.green.1000}',
        '--dads-colors-key-1200': '{colors.green.1200}',
      },
    },
  },
});

const mobileHoriz = css({
  gridAutoFlow: 'column',
  gridTemplateColumns: { base: 'repeat(2, minmax(0, 1fr))', desktop: 'none' },
});
const narrowButton = css({ paddingInline: { base: '12', desktop: '16' } });

const dummy =
  'ダミーテキストは、デザインの作成時に使用される仮の文章です。ダミーテキストは、デザインの作成時に使用される仮の文章です。ダミーテキストは、デザインの作成時に使用される仮の文章です。';

const banners: { type: NotificationBannerType; title: string }[] = [
  { type: 'info1', title: '登録期間が延長されました' },
  { type: 'info2', title: '登録期間が延長されました' },
  { type: 'warning', title: '偽SNSアカウントにご注意ください' },
  { type: 'error', title: '操作を完了できませんでした' },
  { type: 'success', title: '登録手続きは全て完了しました' },
];

type GalleryProps = {
  bannerStyle: NotificationBannerStyle;
  content: 'close' | 'button' | 'button-horizontal';
};

const Gallery = ({ bannerStyle, content }: GalleryProps) => (
  <div className={column}>
    {banners.map(({ type, title }) => (
      <NotificationBanner
        key={type}
        bannerStyle={bannerStyle}
        type={type}
        headingLevel='h2'
        title={title}
      >
        {content === 'close' && <NotificationBannerClose />}
        <NotificationBannerBody>
          {dummy}
          {content !== 'close' && (
            <div className={cx(actions({ type }), content === 'button-horizontal' && mobileHoriz)}>
              <Button
                className={content === 'button-horizontal' ? narrowButton : undefined}
                size='md'
                variant='outline'
              >
                アクションボタン
              </Button>
              <Button
                className={content === 'button-horizontal' ? narrowButton : undefined}
                size='md'
                variant='solid-fill'
              >
                アクションボタン
              </Button>
            </div>
          )}
        </NotificationBannerBody>
      </NotificationBanner>
    ))}
  </div>
);

const galleryArgs = {
  bannerStyle: 'standard',
  type: 'info1',
  title: '登録期間が延長されました',
} as const;

export const Playground: Story = {
  args: {
    bannerStyle: 'standard',
    type: 'info2',
    headingLevel: 'h2',
    title: 'バナータイトル',
    children: (
      <NotificationBannerBody>
        <p>
          <time dateTime='2024-07-01'>2024年7月1日</time>
        </p>
        <p>{dummy}</p>
      </NotificationBannerBody>
    ),
  },
};

export const StandardWithClose: Story = {
  name: 'スタンダード（閉じるボタン）',
  args: galleryArgs,
  render: () => <Gallery bannerStyle='standard' content='close' />,
};

export const ColorChipWithClose: Story = {
  name: 'カラーチップ（閉じるボタン）',
  args: galleryArgs,
  render: () => <Gallery bannerStyle='color-chip' content='close' />,
};

export const StandardWithButton: Story = {
  name: 'スタンダード（アクションボタン）',
  args: galleryArgs,
  render: () => <Gallery bannerStyle='standard' content='button' />,
};

export const ColorChipWithButton: Story = {
  name: 'カラーチップ（アクションボタン）',
  args: galleryArgs,
  render: () => <Gallery bannerStyle='color-chip' content='button' />,
};

export const StandardWithButtonMobileHoriz: Story = {
  name: 'スタンダード（モバイルでボタン横並び）',
  args: galleryArgs,
  render: () => <Gallery bannerStyle='standard' content='button-horizontal' />,
};

export const ColorChipWithButtonMobileHoriz: Story = {
  name: 'カラーチップ（モバイルでボタン横並び）',
  args: galleryArgs,
  render: () => <Gallery bannerStyle='color-chip' content='button-horizontal' />,
};

export const WithoutHeading: Story = {
  name: '見出し要素を使わない',
  args: {
    bannerStyle: 'standard',
    type: 'info1',
    title: 'バナータイトル',
    children: <NotificationBannerBody>{dummy}</NotificationBannerBody>,
  },
};

export const MobileCompact: Story = {
  name: 'モバイル向けコンパクトな閉じるボタン',
  args: {
    bannerStyle: 'standard',
    type: 'info1',
    headingLevel: 'h2',
    title: 'iPhoneのマイナンバーカードは利用準備中です',
  },
  render: (args) => (
    <NotificationBanner {...args}>
      <NotificationBannerMobileClose />
      <NotificationBannerBody>
        <p>
          <time dateTime='2024-07-01'>2024年7月1日</time>
        </p>
        <p>ダミーテキストは、デザインの作成時に使用される仮の文章です。</p>
        <div className={actions({ type: 'info1' })}>
          <Button size='md' variant='outline'>
            アクションボタン
          </Button>
          <Button size='md' variant='solid-fill'>
            アクションボタン
          </Button>
        </div>
      </NotificationBannerBody>
    </NotificationBanner>
  ),
};
