import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { css } from '../../../styled-system/css';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerHeader,
  DrawerHeading,
  type DrawerPlacement,
  DrawerTrigger,
} from './Drawer';
import { useDrawer } from './useDrawer';

const meta = {
  title: 'Components/ドロワー',
  component: Drawer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    placement: { control: 'radio', options: ['right', 'left', 'full'] },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const bar = css({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '16',
  '&[data-placement=left]': { justifyContent: 'flex-start' },
});
const menu = css({ paddingInline: '24', paddingBlock: '16' });
const tallMenu = css({ paddingInline: '24', paddingBlock: '16', height: '62.5rem' });
const menuLink = css({
  display: 'flex',
  alignItems: 'center',
  minHeight: '44',
  borderRadius: '4',
  paddingInline: '16',
  paddingBlock: '12',
  textStyle: 'dns-16N-120',
  _hover: {
    backgroundColor: 'solid-gray.50',
    textDecorationLine: 'underline',
    textUnderlineOffset: '0.1875rem',
  },
  _focusVisible: {
    outlineWidth: '4px',
    outlineStyle: 'solid',
    outlineColor: 'black',
    outlineOffset: '-4px',
    backgroundColor: 'yellow.300',
    boxShadow: 'inset 0 0 0 {spacing.6} {colors.yellow.300}',
  },
});
const page = css({ padding: '16' });
const pageHeading = css({ marginBottom: '32', textStyle: 'std-32B-150' });
const pageText = css({ marginBlock: '16' });

const items = ['メニューアイテム1', 'メニューアイテム2', 'メニューアイテム3', 'メニューアイテム4'];

const Demo = ({ placement = 'right', tall }: { placement?: DrawerPlacement; tall?: boolean }) => {
  const [open, setOpen] = useState(false);
  const { drawerProps, headingProps, triggerProps, closeButtonProps } = useDrawer({
    open,
    onOpenChange: setOpen,
  });

  return (
    <>
      <div className={bar} data-placement={placement}>
        <DrawerTrigger {...triggerProps} />
      </div>
      <Drawer {...drawerProps} placement={placement}>
        <DrawerHeading {...headingProps}>サンプルメニュー</DrawerHeading>
        <DrawerHeader>
          <DrawerClose {...closeButtonProps} />
        </DrawerHeader>
        <DrawerBody>
          <ul className={tall ? tallMenu : menu}>
            {items.map((item) => (
              <li key={item}>
                <a className={menuLink} href='#top'>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </DrawerBody>
      </Drawer>
    </>
  );
};

export const Playground: Story = {
  args: { placement: 'right' },
  render: ({ placement }) => <Demo placement={placement} />,
};

export const Right: Story = {
  name: '右側に表示する',
  render: () => <Demo placement='right' />,
};

export const Left: Story = {
  name: '左側に表示する',
  render: () => <Demo placement='left' />,
};

export const Full: Story = {
  name: '全画面で表示する',
  render: () => <Demo placement='full' />,
};

export const ScrollOnlyMenuArea: Story = {
  name: 'メニュー領域だけをスクロールする',
  render: () => <Demo placement='right' tall={true} />,
};

const dummy =
  'これはダミーテキストです。ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。ダミーテキストを使用すると、デザインの全体像を評価したり、テキストの配置や長さを確認したりすることができます。ダミーテキストは実際の文章ではないので、内容には意味がありません。';

export const WithPageContent: Story = {
  name: 'スクロールバーによるガタつきを防ぐ',
  render: () => (
    <>
      <Demo placement='right' />
      <div className={page}>
        <h2 className={pageHeading}>スクロールバーによるレイアウトのガタつきを防止したサンプル</h2>
        <p className={pageText}>
          プリセットのグローバルCSSが <code>html</code> 要素に <code>scrollbar-gutter</code>{' '}
          を設定しているため、ドロワーを開閉してもメインコンテンツの位置は変わりません。
        </p>
        {['1', '2', '3', '4', '5', '6'].map((key) => (
          <p key={key} className={pageText}>
            {dummy}
            {dummy}
          </p>
        ))}
      </div>
    </>
  ),
};
