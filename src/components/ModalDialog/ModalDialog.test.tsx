import { useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  ModalDialog,
  ModalDialogBody,
  ModalDialogClose,
  ModalDialogContent,
  ModalDialogHeader,
  ModalDialogHeading,
  type ModalDialogProps,
} from './ModalDialog';
import { type ModalDialogRequestCloseEvent, useModalDialog } from './useModalDialog';

type Props = Pick<ModalDialogProps, 'scroll' | 'width'> & {
  onRequestClose?: (event: ModalDialogRequestCloseEvent) => void;
};

const TestDialog = ({ onRequestClose, ...dialog }: Props) => {
  const [open, setOpen] = useState(false);
  const { dialogProps, headingProps, closeButtonProps } = useModalDialog({
    open,
    onOpenChange: setOpen,
    onRequestClose,
  });

  return (
    <>
      <button type='button' onClick={() => setOpen(true)}>
        開く
      </button>
      <ModalDialog {...dialogProps} {...dialog}>
        <ModalDialogContent>
          <ModalDialogHeader>
            <ModalDialogHeading {...headingProps}>見出し</ModalDialogHeading>
            <ModalDialogClose {...closeButtonProps} />
          </ModalDialogHeader>
          <ModalDialogBody>コンテンツ</ModalDialogBody>
        </ModalDialogContent>
      </ModalDialog>
    </>
  );
};

test('opens as a modal labelled by its heading and focuses the heading', async () => {
  const screen = await render(<TestDialog />);

  await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
  await screen.getByRole('button', { name: '開く' }).click();

  const dialog = screen.getByRole('dialog', { name: '見出し' });
  await expect.element(dialog).toBeVisible();
  expect(dialog.element().matches(':modal')).toBe(true);
  await expect.element(screen.getByRole('heading', { level: 2, name: '見出し' })).toHaveFocus();
});

test('closes with the close button and returns focus to the trigger', async () => {
  const screen = await render(<TestDialog />);
  const trigger = screen.getByRole('button', { name: '開く' });

  await trigger.click();
  await screen.getByRole('button', { name: '閉じる' }).click();

  await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
  await expect.element(trigger).toHaveFocus();
});

test('closes with Escape, calls onRequestClose and returns focus', async () => {
  const onRequestClose = vi.fn();
  const screen = await render(<TestDialog onRequestClose={onRequestClose} />);
  const trigger = screen.getByRole('button', { name: '開く' });

  await trigger.click();
  await expect.element(screen.getByRole('dialog')).toBeVisible();
  await userEvent.keyboard('{Escape}');

  await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
  expect(onRequestClose).toHaveBeenCalledOnce();
  await expect.element(trigger).toHaveFocus();
});

test('stays open when onRequestClose prevents the default', async () => {
  const onRequestClose = vi.fn((event: ModalDialogRequestCloseEvent) => event.preventDefault());
  const screen = await render(<TestDialog onRequestClose={onRequestClose} />);

  await screen.getByRole('button', { name: '開く' }).click();
  await userEvent.keyboard('{Escape}');
  await screen.getByRole('button', { name: '閉じる' }).click();

  expect(onRequestClose).toHaveBeenCalledTimes(2);
  await expect.element(screen.getByRole('dialog')).toBeVisible();
});

test('keeps focus inside the dialog while open', async () => {
  const screen = await render(<TestDialog />);

  await screen.getByRole('button', { name: '開く' }).click();
  await userEvent.keyboard('{Tab}');
  await expect.element(screen.getByRole('button', { name: '閉じる' })).toHaveFocus();
  await userEvent.keyboard('{Tab}');

  expect(document.activeElement).not.toBe(screen.getByText('開く').element());
});

test('applies the DADS panel and backdrop design', async () => {
  const screen = await render(<TestDialog width='360px' scroll='inner' />);

  await screen.getByRole('button', { name: '開く' }).click();
  const dialog = screen.getByRole('dialog').element();
  const panel = dialog.firstElementChild as HTMLElement;
  const panelStyle = getComputedStyle(panel);

  expect(getComputedStyle(dialog).display).toBe('flex');
  expect(getComputedStyle(dialog).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(getComputedStyle(dialog, '::backdrop').backgroundColor).toBe('rgba(0, 0, 0, 0.6)');
  expect(getComputedStyle(dialog, '::before').flexShrink).toBe('9999');
  expect(panelStyle.backgroundColor).toBe('rgb(255, 255, 255)');
  expect(panelStyle.borderTopColor).toBe('rgb(0, 0, 0)');
  expect(panelStyle.borderTopLeftRadius).toBe('8px');
  expect(panelStyle.width).toBe('360px');
  expect(panelStyle.flexShrink).toBe('1');
  expect(panelStyle.overflowY).toBe('auto');
});
