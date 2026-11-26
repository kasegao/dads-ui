import type { ComponentProps } from 'react';
import { css, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

const horizontalMenu = css({
  display: 'flex',
  alignItems: 'stretch',
  borderBottomWidth: '1',
  borderBottomStyle: 'solid',
  borderBottomColor: 'solid-gray.420',
  color: 'solid-gray.900',
  textStyle: 'dns-16B-130',
});

const horizontalMenuItem = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'stretch',
});

const underline = {
  content: '""',
  position: 'absolute',
  insetInline: '0',
  bottom: '0',
  borderBottomStyle: 'solid',
} as const;

const horizontalMenuItemInner = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '4',
  minHeight: '64',
  paddingInline: '20',
  paddingBlock: '16',
  cursor: 'pointer',
  _hover: {
    backgroundColor: 'solid-gray.50',
    _after: { ...underline, borderBottomWidth: '2px', borderBottomColor: 'black' },
  },
  _focusVisible: { ...focusRing, borderRadius: '4', backgroundColor: 'yellow.300' },
  '&[aria-current]:not([aria-current=false])': {
    backgroundColor: 'white',
    color: 'key.1000',
    _after: { ...underline, borderBottomWidth: '4px', borderBottomColor: 'key.900' },
    _hover: {
      color: 'key.900',
      textDecorationLine: 'underline',
      textDecorationThickness: '1px',
      textUnderlineOffset: '0.1875rem',
      _after: { borderBottomWidth: '4px', borderBottomColor: 'key.900' },
    },
    _focusVisible: { backgroundColor: 'white' },
  },
  // Flips a trailing chevron icon while the submenu is open.
  '&[aria-expanded=true] > svg:last-child': { transform: 'rotate(180deg)' },
});

export type HorizontalMenuProps = ComponentProps<'ul'>;

export const HorizontalMenu = (props: HorizontalMenuProps) => {
  const { children, className, ...rest } = props;
  return (
    <ul className={cx(horizontalMenu, className)} {...rest}>
      {children}
    </ul>
  );
};

export type HorizontalMenuItemProps = ComponentProps<'li'>;

export const HorizontalMenuItem = (props: HorizontalMenuItemProps) => {
  const { children, className, ...rest } = props;
  return (
    <li className={cx(horizontalMenuItem, className)} {...rest}>
      {children}
    </li>
  );
};

export type HorizontalMenuItemLinkProps = ComponentProps<'a'>;

export const HorizontalMenuItemLink = (props: HorizontalMenuItemLinkProps) => {
  const { children, className, ...rest } = props;
  return (
    <a className={cx(horizontalMenuItemInner, className)} {...rest}>
      {children}
    </a>
  );
};

export type HorizontalMenuItemButtonProps = Omit<ComponentProps<'button'>, 'type'>;

export const HorizontalMenuItemButton = (props: HorizontalMenuItemButtonProps) => {
  const { children, className, ...rest } = props;
  return (
    <button type='button' className={cx(horizontalMenuItemInner, className)} {...rest}>
      {children}
    </button>
  );
};
