import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useRef, useState } from 'react';
import { css } from '../../../styled-system/css';
import {
  CloseIcon,
  CloseWithLabelIcon,
  HamburgerIcon,
  HamburgerMenuButton,
  HamburgerMenuIconButton,
  HamburgerWithLabelIcon,
} from './HamburgerMenuButton';

const meta = {
  title: 'Components/ハンバーガーメニューボタン',
  component: HamburgerMenuButton,
  tags: ['autodocs'],
} satisfies Meta<typeof HamburgerMenuButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = css({ display: 'flex', flexDirection: 'column', gap: '8', margin: '16' });
const row = css({ display: 'flex', gap: '96', margin: '16', minHeight: '160' });
const relative = css({ position: 'relative' });
const sampleMenu = css({
  width: '11rem',
  height: '160',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'solid-gray.420',
  backgroundColor: 'white',
  padding: '16',
});
const floatingMenu = css({ position: 'absolute' });

export const Playground: Story = {
  render: (args) => {
    const menuId = useId();
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className={column}>
        <HamburgerMenuButton
          {...args}
          aria-controls={menuId}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <>
              <CloseIcon />
              閉じる
            </>
          ) : (
            <>
              <HamburgerIcon />
              メニュー
            </>
          )}
        </HamburgerMenuButton>
        {isOpen && (
          <div className={sampleMenu} id={menuId}>
            サンプルメニュー
          </div>
        )}
      </div>
    );
  },
};

export const MobileOnly: Story = {
  name: 'モバイル条件付き（アイコンボタン）',
  render: () => {
    const jaMenuId = useId();
    const enMenuId = useId();
    const [isJaOpen, setIsJaOpen] = useState(false);
    const [isEnOpen, setIsEnOpen] = useState(false);
    return (
      <div className={row}>
        <div className={relative}>
          <HamburgerMenuIconButton
            aria-controls={jaMenuId}
            aria-expanded={isJaOpen}
            onClick={() => setIsJaOpen(!isJaOpen)}
          >
            {isJaOpen ? <CloseWithLabelIcon /> : <HamburgerWithLabelIcon />}
          </HamburgerMenuIconButton>
          {isJaOpen && (
            <div className={`${sampleMenu} ${floatingMenu}`} id={jaMenuId}>
              サンプルメニュー
            </div>
          )}
        </div>
        <div className={relative}>
          <HamburgerMenuIconButton
            aria-controls={enMenuId}
            aria-expanded={isEnOpen}
            onClick={() => setIsEnOpen(!isEnOpen)}
          >
            {isEnOpen ? (
              <CloseWithLabelIcon isEnglish={true} />
            ) : (
              <HamburgerWithLabelIcon isEnglish={true} />
            )}
          </HamburgerMenuIconButton>
          {isEnOpen && (
            <div className={`${sampleMenu} ${floatingMenu}`} id={enMenuId} lang='en'>
              Sample menu
            </div>
          )}
        </div>
      </div>
    );
  },
};

const drawer = css({
  margin: 'unset',
  maxWidth: 'full',
  maxHeight: 'unset',
  width: '18rem',
  height: '100dvh',
  insetInlineEnd: 'auto',
  backgroundColor: 'white',
  boxShadow: '2',
  _backdrop: { backgroundColor: 'opacity-gray.100' },
});

const drawerLink = css({
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

export const WithDrawer: Story = {
  name: 'ドロワーを開く',
  parameters: { layout: 'fullscreen' },
  render: () => {
    const headingId = useId();
    const drawerRef = useRef<HTMLDialogElement>(null);
    return (
      <>
        <div className={css({ display: 'flex', padding: '16' })}>
          <HamburgerMenuButton onClick={() => drawerRef.current?.showModal()}>
            <HamburgerIcon />
            メニュー
          </HamburgerMenuButton>
        </div>
        <dialog aria-labelledby={headingId} className={drawer} ref={drawerRef}>
          <h2 className={css({ srOnly: true })} id={headingId}>
            サンプルメニュー
          </h2>
          <div className={css({ display: 'flex', padding: '16' })}>
            <HamburgerMenuButton onClick={() => drawerRef.current?.close()}>
              <CloseIcon />
              閉じる
            </HamburgerMenuButton>
          </div>
          <ul className={css({ paddingInline: '24', paddingBlock: '16' })}>
            {[
              'メニューアイテム1',
              'メニューアイテム2',
              'メニューアイテム3',
              'メニューアイテム4',
            ].map((name) => (
              <li key={name}>
                <a className={drawerLink} href='#sample'>
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </dialog>
      </>
    );
  },
};
