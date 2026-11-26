import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode, useState } from 'react';
import { css } from '../../../styled-system/css';
import { Button } from '../Button';
import {
  ModalDialog,
  ModalDialogActions,
  ModalDialogBody,
  ModalDialogClose,
  ModalDialogContent,
  ModalDialogHeader,
  ModalDialogHeading,
  type ModalDialogProps,
  ModalDialogScrollArea,
} from './ModalDialog';
import { useModalDialog } from './useModalDialog';

type DemoArgs = Pick<ModalDialogProps, 'scroll' | 'width'> & {
  hasCloseButton?: boolean;
  longContent?: boolean;
};

const meta: Meta<DemoArgs> = {
  title: 'Components/モーダルダイアログ',
  component: ModalDialog,
  tags: ['autodocs'],
  argTypes: {
    scroll: { control: 'radio', options: ['outer', 'inner'] },
    width: { control: 'text' },
    hasCloseButton: { control: 'boolean' },
    longContent: { control: 'boolean' },
  },
  args: { hasCloseButton: true, longContent: false },
};

export default meta;
type Story = StoryObj<DemoArgs>;

const actionsEnd = css({ display: 'flex', justifyContent: 'flex-end' });
const paragraph = css({ marginBlock: '16' });

const paragraphs = Array.from({ length: 50 }, (_, i) => `p-${i + 1}`);

const Content = ({ long }: { long?: boolean }) =>
  long ? (
    paragraphs.map((id) => (
      <p key={id} className={paragraph}>
        コンテンツ
      </p>
    ))
  ) : (
    <>コンテンツ</>
  );

type Fixed = 'none' | 'header' | 'actions' | 'both';

const Demo = (props: DemoArgs & { label: string; fixed?: Fixed }) => {
  const { label, fixed = 'none', hasCloseButton = true, longContent, scroll, width } = props;
  const [open, setOpen] = useState(false);
  const { dialogProps, headingProps, closeButtonProps } = useModalDialog({
    open,
    onOpenChange: setOpen,
  });

  const head = (
    <ModalDialogHeader>
      <ModalDialogHeading {...headingProps}>タイトル</ModalDialogHeading>
      {hasCloseButton && <ModalDialogClose {...closeButtonProps} />}
    </ModalDialogHeader>
  );
  const main = (
    <ModalDialogBody>
      <Content long={longContent} />
    </ModalDialogBody>
  );
  const foot = (
    <ModalDialogActions className={actionsEnd}>
      <Button size='lg' variant='solid-fill' {...closeButtonProps}>
        OK
      </Button>
    </ModalDialogActions>
  );

  const layouts: Record<Fixed, ReactNode> = {
    none: (
      <>
        {head}
        {main}
        {foot}
      </>
    ),
    header: (
      <>
        {head}
        <ModalDialogScrollArea>
          {main}
          {foot}
        </ModalDialogScrollArea>
      </>
    ),
    actions: (
      <>
        <ModalDialogScrollArea>
          {head}
          {main}
        </ModalDialogScrollArea>
        {foot}
      </>
    ),
    both: (
      <>
        {head}
        <ModalDialogScrollArea>{main}</ModalDialogScrollArea>
        {foot}
      </>
    ),
  };

  return (
    <>
      <Button size='lg' variant='solid-fill' onClick={() => setOpen(true)}>
        {label}
      </Button>
      <ModalDialog {...dialogProps} scroll={scroll} width={width}>
        <ModalDialogContent>{layouts[fixed]}</ModalDialogContent>
      </ModalDialog>
    </>
  );
};

export const Playground: Story = {
  render: (args) => <Demo {...args} label='ダイアログを開く' />,
};

export const LongContent: Story = {
  name: '外側スクロール',
  args: { longContent: true },
  render: (args) => <Demo {...args} label='全体がスクロールするダイアログを開く' />,
};

export const InnerScroll: Story = {
  name: '内側スクロール',
  args: { scroll: 'inner', longContent: true },
  render: (args) => <Demo {...args} label='内側がスクロールするダイアログを開く' />,
};

export const InnerScrollWithFixedHeader: Story = {
  name: 'ヘッダー固定',
  args: { scroll: 'inner', longContent: true },
  render: (args) => <Demo {...args} fixed='header' label='ヘッダーが固定されるダイアログを開く' />,
};

export const InnerScrollWithFixedActions: Story = {
  name: 'アクション固定',
  args: { scroll: 'inner', longContent: true },
  render: (args) => (
    <Demo {...args} fixed='actions' label='アクションエリアが固定されるダイアログを開く' />
  ),
};

export const InnerScrollWithFixedBoth: Story = {
  name: 'ヘッダー＆アクション固定',
  args: { scroll: 'inner', longContent: true },
  render: (args) => (
    <Demo {...args} fixed='both' label='ヘッダーとアクションエリアが固定されるダイアログを開く' />
  ),
};

export const FixedWidth: Story = {
  name: '幅指定',
  args: { width: '800px' },
  render: (args) => <Demo {...args} label='幅800pxのダイアログを開く' />,
};

export const WithoutCloseButton: Story = {
  name: '閉じるボタンなし',
  args: { hasCloseButton: false },
  render: (args) => <Demo {...args} label='閉じるボタンのないダイアログを開く' />,
};

const ConfirmDemo = () => {
  const [open, setOpen] = useState(false);
  const { dialogProps, headingProps, closeButtonProps } = useModalDialog({
    open,
    onOpenChange: setOpen,
    onRequestClose: (event) => {
      if (!window.confirm('入力内容は保存されません。閉じてよろしいですか？')) {
        event.preventDefault();
      }
    },
  });

  return (
    <>
      <Button size='lg' variant='solid-fill' onClick={() => setOpen(true)}>
        確認つきのダイアログを開く
      </Button>
      <ModalDialog {...dialogProps}>
        <ModalDialogContent>
          <ModalDialogHeader>
            <ModalDialogHeading {...headingProps}>タイトル</ModalDialogHeading>
            <ModalDialogClose {...closeButtonProps} />
          </ModalDialogHeader>
          <ModalDialogBody>閉じる前に確認します。</ModalDialogBody>
        </ModalDialogContent>
      </ModalDialog>
    </>
  );
};

export const ConfirmBeforeClose: Story = {
  name: '閉じる操作をキャンセルする',
  render: () => <ConfirmDemo />,
};
