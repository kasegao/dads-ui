import type { ComponentProps, CSSProperties } from 'react';
import { css, cva, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

export type MenuListType = 'standard' | 'box';
export type MenuListSize = 'regular' | 'small';

const menuList = css({
  position: 'relative',
  zIndex: '0',
  color: 'solid-gray.800',
  textStyle: 'dns-16N-130',
});

const menuListItem = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '8',
    paddingRight: '16',
    textAlign: 'left',
    textDecorationThickness: '1px',
    cursor: 'pointer',
    _hover: {
      backgroundColor: 'solid-gray.50',
      textDecorationLine: 'underline',
      textUnderlineOffset: '0.1875rem',
    },
    _focusVisible: { position: 'relative', zIndex: '1', backgroundColor: 'yellow.300' },
    '&[data-current]': {
      backgroundColor: 'key.100',
      color: 'key.1000',
      fontWeight: '700',
      _hover: { backgroundColor: 'key.50', color: 'key.900' },
      _focusVisible: { backgroundColor: 'key.100' },
    },
    // Parent item of a nested list that contains the current item.
    '&:has(+ * [data-current])': {
      backgroundColor: 'key.50',
      color: 'key.1000',
      _hover: { backgroundColor: 'key.50', color: 'key.900' },
      _focusVisible: { backgroundColor: 'key.50' },
    },
    // Flips a trailing chevron icon while the child list is open.
    '&[aria-expanded=true] > svg:last-child': { transform: 'rotate(180deg)' },
  },
  variants: {
    type: {
      standard: {
        marginLeft: 'calc(1rem * var(--menu-list-indentation, 0))',
        width: 'calc(100% - 1rem * var(--menu-list-indentation, 0))',
        paddingLeft: '16',
        _focusVisible: { ...focusRing },
      },
      box: {
        width: 'full',
        paddingLeft: 'calc(1rem + 1rem * var(--menu-list-indentation, 0))',
        _focusVisible: {
          outlineWidth: '4px',
          outlineStyle: 'solid',
          outlineColor: 'black',
          outlineOffset: '-4px',
          boxShadow: 'inset 0 0 0 {spacing.6} {colors.yellow.300}',
        },
      },
    },
    size: {
      regular: { minHeight: '44', paddingBlock: '10' },
      small: { minHeight: '36', paddingBlock: '6', textStyle: 'dns-16N-120' },
    },
  },
  compoundVariants: [
    { type: 'standard', size: 'regular', css: { borderRadius: '8' } },
    { type: 'standard', size: 'small', css: { borderRadius: '4' } },
  ],
});

export type MenuListProps = ComponentProps<'ul'> & {
  /** Indent level of a nested list: `1` indents by one step, `2` by two. */
  indent?: number;
};

export const MenuList = (props: MenuListProps) => {
  const { children, className, indent, style, ...rest } = props;

  return (
    <ul
      className={cx(menuList, className)}
      style={
        indent !== undefined
          ? ({ ...style, '--menu-list-indentation': indent } as CSSProperties)
          : style
      }
      {...rest}
    >
      {children}
    </ul>
  );
};

export type MenuListItemProps = ComponentProps<'li'>;

export const MenuListItem = (props: MenuListItemProps) => {
  const { children, ...rest } = props;
  return <li {...rest}>{children}</li>;
};

type MenuListItemSharedProps = {
  /** `standard` has rounded corners, `box` is rectangular. */
  type: MenuListType;
  size: MenuListSize;
  /** Visual "current" state only. Pair it with `aria-current` or `aria-selected`. */
  current?: boolean;
};

export type MenuListItemButtonProps = Omit<ComponentProps<'button'>, 'type'> &
  MenuListItemSharedProps;

export const MenuListItemButton = (props: MenuListItemButtonProps) => {
  const { children, className, type, size, current, ...rest } = props;

  return (
    <button
      type='button'
      data-current={current ? '' : undefined}
      className={cx(menuListItem({ type, size }), className)}
      {...rest}
    >
      {children}
    </button>
  );
};

export type MenuListItemLinkProps = Omit<ComponentProps<'a'>, 'type'> & MenuListItemSharedProps;

export const MenuListItemLink = (props: MenuListItemLinkProps) => {
  const { children, className, type, size, current, ...rest } = props;

  return (
    <a
      data-current={current ? '' : undefined}
      className={cx(menuListItem({ type, size }), className)}
      {...rest}
    >
      {children}
    </a>
  );
};
