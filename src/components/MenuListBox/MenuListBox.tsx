import { Menu, useMenuContext } from '@ark-ui/react/menu';
import { type ComponentProps, type KeyboardEvent, useId } from 'react';
import { css, cva, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

export type MenuListBoxOpenerSize = 'sm' | 'md';
export type MenuListBoxOpenerStyle = 'text' | 'outlined' | 'filled';
export type MenuListBoxOpenerFontWeight = 'normal' | 'bold';
export type MenuListBoxItemSize = 'regular' | 'small';
export type MenuListBoxSelectDetail = Menu.SelectionDetails;

const menuListBox = css({
  position: 'relative',
  display: 'block',
  width: 'fit',
  color: 'solid-gray.900',
  textStyle: 'dns-16N-120',
});

const menuListBoxOpener = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '8',
    paddingBlock: '4',
    cursor: 'pointer',
    _hover: {
      backgroundColor: 'solid-gray.50',
      textDecorationLine: 'underline',
      textUnderlineOffset: '0.1875rem',
    },
    _focusVisible: { ...focusRing, backgroundColor: 'yellow.300' },
    '& > svg': { flexShrink: '0' },
    '&[aria-expanded=true] > [data-opener-arrow]': { transform: 'rotate(180deg)' },
  },
  variants: {
    size: {
      sm: { minHeight: '36', paddingInline: '4', columnGap: '4' },
      md: { minHeight: '44', paddingInline: '16', columnGap: '8' },
    },
    buttonStyle: {
      text: {},
      outlined: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'solid-gray.420',
        _hover: { borderColor: 'black' },
      },
      filled: {
        backgroundColor: 'solid-gray.50',
        _hover: { backgroundColor: 'solid-gray.100' },
        _focusVisible: { backgroundColor: 'solid-gray.50' },
      },
    },
    fontWeight: {
      normal: {},
      bold: { fontWeight: '700' },
    },
  },
});

const openerArrow = css({ marginTop: '4', width: '16', height: '16' });

const menuListBoxPopup = css({
  width: 'max',
  maxHeight: 'calc((16 + 44 * 6.5) / 16 * 1rem)',
  overflowY: 'auto',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'solid-gray.420',
  borderTopLeftRadius: '8',
  borderBottomLeftRadius: '8',
  backgroundColor: 'white',
  paddingBlock: '16',
  boxShadow: '1',
  color: 'solid-gray.800',
  // The highlighted item carries the focus indicator.
  _focusVisible: { outlineStyle: 'none' },
});

const menuListBoxItem = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '8',
    width: 'full',
    paddingInline: '16',
    textDecorationThickness: '1px',
    cursor: 'pointer',
    '& > svg': { flexShrink: '0' },
    _highlighted: {
      backgroundColor: 'solid-gray.50',
      textDecorationLine: 'underline',
      textUnderlineOffset: '0.1875rem',
    },
    '&[data-current]': {
      backgroundColor: 'key.100',
      color: 'key.1000',
      fontWeight: '700',
      _highlighted: { backgroundColor: 'key.50', color: 'key.900' },
    },
    _disabled: { color: 'solid-gray.420', cursor: 'default' },
    // Keyboard focus: the menu holds DOM focus and points at the highlighted item.
    '&[data-highlighted]': {
      '[role=menu]:focus-visible &': {
        position: 'relative',
        zIndex: '1',
        outlineWidth: '4px',
        outlineStyle: 'solid',
        outlineColor: 'black',
        outlineOffset: '-4px',
        backgroundColor: 'yellow.300',
        boxShadow: 'inset 0 0 0 {spacing.6} {colors.yellow.300}',
      },
    },
    '&[data-highlighted][data-current]': {
      '[role=menu]:focus-visible &': { backgroundColor: 'key.100' },
    },
  },
  variants: {
    size: {
      regular: { minHeight: '44', paddingBlock: '10', textStyle: 'dns-16N-130' },
      small: { minHeight: '36', paddingBlock: '6', textStyle: 'dns-16N-120' },
    },
  },
});

type MenuOptions = Pick<
  Menu.RootProps,
  | 'open'
  | 'defaultOpen'
  | 'onOpenChange'
  | 'onSelect'
  | 'positioning'
  | 'closeOnSelect'
  | 'loopFocus'
  | 'typeahead'
  | 'lazyMount'
  | 'unmountOnExit'
>;

export type MenuListBoxProps = Omit<ComponentProps<'div'>, 'onSelect'> & MenuOptions;

/** Menu button: an opener that shows a popup list of actions. */
export const MenuListBox = (props: MenuListBoxProps) => {
  const {
    open,
    defaultOpen,
    onOpenChange,
    onSelect,
    positioning,
    closeOnSelect,
    loopFocus,
    typeahead,
    lazyMount,
    unmountOnExit,
    children,
    className,
    ...rest
  } = props;

  return (
    <Menu.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      onSelect={onSelect}
      positioning={{ placement: 'bottom-start', gutter: 0, ...positioning }}
      closeOnSelect={closeOnSelect}
      loopFocus={loopFocus}
      typeahead={typeahead}
      lazyMount={lazyMount}
      unmountOnExit={unmountOnExit}
    >
      <div className={cx(menuListBox, className)} {...rest}>
        {children}
      </div>
    </Menu.Root>
  );
};

export type MenuListBoxOpenerProps = Menu.TriggerProps & {
  size: MenuListBoxOpenerSize;
  buttonStyle: MenuListBoxOpenerStyle;
  fontWeight?: MenuListBoxOpenerFontWeight;
};

export const MenuListBoxOpener = (props: MenuListBoxOpenerProps) => {
  const { children, className, size, buttonStyle, fontWeight = 'normal', ...rest } = props;

  return (
    <Menu.Trigger
      className={cx(menuListBoxOpener({ size, buttonStyle, fontWeight }), className)}
      {...rest}
    >
      {children}
      <svg
        aria-hidden={true}
        className={openerArrow}
        data-opener-arrow=''
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='currentColor'
      >
        <path d='m20.5 6.6-8 8-8-8L3.1 8l9.4 9.4L21.9 8l-1.4-1.4Z' />
      </svg>
    </Menu.Trigger>
  );
};

export type MenuListBoxPopupProps = ComponentProps<'ul'>;

export const MenuListBoxPopup = (props: MenuListBoxPopupProps) => {
  const { children, className, onKeyDown, ...rest } = props;
  const menu = useMenuContext();

  // Ark keeps Tab inside the menu; DADS closes it so focus can move on from the opener.
  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    onKeyDown?.(event);
    if (event.key === 'Tab') menu.setOpen(false);
  };

  return (
    <Menu.Positioner>
      <Menu.Content asChild={true}>
        <ul className={cx(menuListBoxPopup, className)} onKeyDown={handleKeyDown} {...rest}>
          {children}
        </ul>
      </Menu.Content>
    </Menu.Positioner>
  );
};

export type MenuListBoxItemProps = Omit<Menu.ItemProps, 'value' | 'asChild'> & {
  /** Identifies the item in `onSelect`. Defaults to a generated id. */
  value?: string;
  size?: MenuListBoxItemSize;
  /** Visual "current" state only. */
  current?: boolean;
};

export const MenuListBoxItem = (props: MenuListBoxItemProps) => {
  const { children, className, value, size = 'regular', current, ...rest } = props;
  const fallbackValue = useId();

  return (
    <li role='presentation'>
      <Menu.Item
        className={cx(menuListBoxItem({ size }), className)}
        data-current={current ? '' : undefined}
        value={value ?? fallbackValue}
        {...rest}
      >
        {children}
      </Menu.Item>
    </li>
  );
};
