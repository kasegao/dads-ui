import { useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
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

type Props = {
  placement?: DrawerPlacement;
  onOpenChange?: (open: boolean) => void;
};

const TestDrawer = ({ placement, onOpenChange }: Props) => {
  const [open, setOpen] = useState(false);
  const { drawerProps, headingProps, triggerProps, closeButtonProps } = useDrawer({
    open,
    onOpenChange: (next) => {
      setOpen(next);
      onOpenChange?.(next);
    },
  });

  return (
    <>
      <DrawerTrigger {...triggerProps} />
      <Drawer {...drawerProps} placement={placement}>
        <DrawerHeading {...headingProps}>サンプルメニュー</DrawerHeading>
        <DrawerHeader>
          <DrawerClose {...closeButtonProps} />
        </DrawerHeader>
        <DrawerBody>
          <a href='#item'>メニューアイテム1</a>
        </DrawerBody>
      </Drawer>
    </>
  );
};

test('opens as a modal dialog named by its hidden heading', async () => {
  const screen = await render(<TestDrawer />);
  const trigger = screen.getByRole('button', { name: 'メニュー' });

  await expect.element(trigger).toHaveAttribute('aria-haspopup', 'dialog');
  await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
  await trigger.click();

  const drawer = screen.getByRole('dialog', { name: 'サンプルメニュー' });
  await expect.element(drawer).toBeVisible();
  expect(drawer.element().matches(':modal')).toBe(true);
  await expect.element(screen.getByRole('button', { name: '閉じる' })).toHaveFocus();
});

test('closes with the close button and returns focus to the trigger', async () => {
  const onOpenChange = vi.fn();
  const screen = await render(<TestDrawer onOpenChange={onOpenChange} />);
  const trigger = screen.getByRole('button', { name: 'メニュー' });

  await trigger.click();
  await screen.getByRole('button', { name: '閉じる' }).click();

  await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
  await expect.element(trigger).toHaveFocus();
  expect(onOpenChange).toHaveBeenLastCalledWith(false);
});

test('closes with Escape, syncs state and returns focus', async () => {
  const onOpenChange = vi.fn();
  const screen = await render(<TestDrawer onOpenChange={onOpenChange} />);
  const trigger = screen.getByRole('button', { name: 'メニュー' });

  await trigger.click();
  await expect.element(screen.getByRole('dialog')).toBeVisible();
  await userEvent.keyboard('{Escape}');

  await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
  await expect.element(trigger).toHaveFocus();
  expect(onOpenChange).toHaveBeenLastCalledWith(false);

  await trigger.click();
  await expect.element(screen.getByRole('dialog')).toBeVisible();
});

test('keeps focus inside the drawer while open', async () => {
  const screen = await render(<TestDrawer />);

  await screen.getByRole('button', { name: 'メニュー' }).click();
  await userEvent.keyboard('{Tab}');
  await expect.element(screen.getByRole('link', { name: 'メニューアイテム1' })).toHaveFocus();
  await userEvent.keyboard('{Tab}');

  expect(document.activeElement).not.toBe(screen.getByText('メニュー', { exact: true }).element());
});

test('attaches the panel to the chosen side with the DADS design', async () => {
  const right = await render(<TestDrawer placement='right' />);
  await right.getByRole('button', { name: 'メニュー' }).click();
  const rightPanel = right.getByRole('dialog').element();
  const rightStyle = getComputedStyle(rightPanel);

  expect(rightStyle.width).toBe('288px');
  expect(rightStyle.backgroundColor).toBe('rgb(255, 255, 255)');
  expect(rightStyle.display).toBe('grid');
  expect(getComputedStyle(rightPanel, '::backdrop').backgroundColor).toBe('rgba(0, 0, 0, 0.1)');
  await expect
    .poll(() => Math.round(rightPanel.getBoundingClientRect().right))
    .toBe(document.documentElement.clientWidth);
  expect(rightPanel.getBoundingClientRect().height).toBe(window.innerHeight);
  await right.unmount();

  const left = await render(<TestDrawer placement='left' />);
  await left.getByRole('button', { name: 'メニュー' }).click();
  const leftPanel = left.getByRole('dialog').element();

  await expect.poll(() => Math.round(leftPanel.getBoundingClientRect().left)).toBe(0);
  const closeRect = left.getByRole('button', { name: '閉じる' }).element().getBoundingClientRect();
  expect(closeRect.left).toBeLessThan(leftPanel.getBoundingClientRect().width / 2);
  await left.unmount();

  const full = await render(<TestDrawer placement='full' />);
  await full.getByRole('button', { name: 'メニュー' }).click();

  expect(full.getByRole('dialog').element().getBoundingClientRect().width).toBe(
    document.documentElement.clientWidth,
  );
});
