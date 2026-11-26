import { Menu, useMenuContext } from '@ark-ui/react/menu';
import { type ComponentProps, type KeyboardEvent, useId } from 'react';
import { css, cva, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

const languageSelector = css({ position: 'relative', display: 'block', width: 'fit' });

const languageSelectorButton = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    width: 'fit',
    minHeight: '44',
    color: 'solid-gray.800',
    textStyle: 'oln-16N-100',
    cursor: 'pointer',
    _hover: {
      backgroundColor: 'solid-gray.50',
      textDecorationLine: 'underline',
      textUnderlineOffset: '0.1875rem',
    },
    _focusVisible: { ...focusRing, backgroundColor: 'yellow.300' },
  },
  variants: {
    iconOnly: {
      false: { gap: '4', borderRadius: '8', paddingInline: '8' },
      true: {
        borderRadius: '4',
        _hover: { outlineWidth: '1px', outlineStyle: 'solid', outlineColor: 'black' },
      },
    },
  },
});

const arrowIcon = css({
  flexShrink: '0',
  marginTop: '2',
  '[aria-expanded=true] > &': { transform: 'rotate(180deg)' },
});

const globeIcon = css({ flexShrink: '0' });

const languageSelectorMenu = cva({
  base: {
    width: 'auto',
    minWidth: 'fit',
    overflowY: 'auto',
    borderWidth: '1',
    borderStyle: 'solid',
    borderColor: 'solid-gray.420',
    borderRadius: '8',
    backgroundColor: 'white',
    paddingBlock: '8',
    boxShadow: '1',
    // The highlighted item carries the focus indicator.
    _focusVisible: { outlineStyle: 'none' },
    // Square off the scrollbar side once the list scrolls.
    '&:has(> :nth-child(7))': { borderTopRightRadius: '0', borderBottomRightRadius: '0' },
  },
  variants: {
    isCondensed: {
      false: { maxHeight: 'calc((44 * 6.5 + 16) / 16 * 1rem)' },
      true: { maxHeight: 'calc((36 * 6.5 + 16) / 16 * 1rem)' },
    },
  },
});

const languageSelectorMenuItem = cva({
  base: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    columnGap: '8',
    paddingInline: '16',
    color: 'solid-gray.800',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    '& > svg': { flexShrink: '0', visibility: 'hidden' },
    _highlighted: {
      backgroundColor: 'solid-gray.50',
      textDecorationLine: 'underline',
      textUnderlineOffset: '0.1875rem',
    },
    '&[data-current]': {
      backgroundColor: 'key.100',
      color: 'key.1000',
      fontWeight: '700',
      '& > svg': { visibility: 'visible' },
      _highlighted: { backgroundColor: 'key.50', color: 'key.900' },
    },
    // Keyboard focus: the menu holds DOM focus and points at the highlighted item.
    '&[data-highlighted]': {
      '[role=menu]:focus-visible &': {
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
    isCondensed: {
      false: { minHeight: '44', paddingBlock: '10', textStyle: 'dns-16N-130' },
      true: { minHeight: '36', paddingBlock: '6', textStyle: 'dns-16N-120' },
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

export type LanguageSelectorProps = Omit<ComponentProps<'div'>, 'onSelect'> & MenuOptions;

export const LanguageSelector = (props: LanguageSelectorProps) => {
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
      <div className={cx(languageSelector, className)} {...rest}>
        {children}
      </div>
    </Menu.Root>
  );
};

export type LanguageSelectorButtonProps = Menu.TriggerProps & {
  /** Compact style for a button that only holds `LanguageSelectorGlobeWithLabelIcon`. */
  iconOnly?: boolean;
};

export const LanguageSelectorButton = (props: LanguageSelectorButtonProps) => {
  const { children, className, iconOnly = false, ...rest } = props;
  return (
    <Menu.Trigger className={cx(languageSelectorButton({ iconOnly }), className)} {...rest}>
      {children}
    </Menu.Trigger>
  );
};

export type LanguageSelectorMenuProps = ComponentProps<'ul'> & {
  /** Use together with `isCondensed` on every item. */
  isCondensed?: boolean;
};

export const LanguageSelectorMenu = (props: LanguageSelectorMenuProps) => {
  const { children, className, isCondensed = false, onKeyDown, ...rest } = props;
  const menu = useMenuContext();

  // Ark keeps Tab inside the menu; DADS closes it so focus can move on from the button.
  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    onKeyDown?.(event);
    if (event.key === 'Tab') menu.setOpen(false);
  };

  return (
    <Menu.Positioner>
      <Menu.Content asChild={true}>
        <ul
          className={cx(languageSelectorMenu({ isCondensed }), className)}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {children}
        </ul>
      </Menu.Content>
    </Menu.Positioner>
  );
};

export type LanguageSelectorMenuItemProps = ComponentProps<'a'> & {
  /** Identifies the item in `onSelect`. Defaults to a generated id. */
  value?: string;
  isCurrent?: boolean;
  isCondensed?: boolean;
};

export const LanguageSelectorMenuItem = (props: LanguageSelectorMenuItemProps) => {
  const { children, className, value, isCurrent, isCondensed = false, ...rest } = props;
  const fallbackValue = useId();

  return (
    <li role='presentation'>
      <Menu.Item asChild={true} value={value ?? fallbackValue}>
        <a
          aria-current={isCurrent || undefined}
          className={cx(languageSelectorMenuItem({ isCondensed }), className)}
          data-current={isCurrent ? '' : undefined}
          tabIndex={-1}
          {...rest}
        >
          <svg aria-hidden={true} fill='currentColor' height='24' viewBox='0 0 24 24' width='24'>
            <path d='m9.5 18-5.7-5.7 1.5-1.4 4.2 4.3L18.7 6l1.4 1.4L9.5 18Z' />
          </svg>
          {children}
        </a>
      </Menu.Item>
    </li>
  );
};

export type LanguageSelectorArrowIconProps = ComponentProps<'svg'>;

/** Chevron for `LanguageSelectorButton`; flips while the menu is open. */
export const LanguageSelectorArrowIcon = (props: LanguageSelectorArrowIconProps) => {
  const { className, ...rest } = props;
  return (
    <svg
      aria-hidden={true}
      className={cx(arrowIcon, className)}
      fill='none'
      height='16'
      viewBox='0 0 16 16'
      width='16'
      {...rest}
    >
      <path
        d='M8 11.4L2 5.33332L2.66667 4.66666L8 9.99999L13.3333 4.66666L14 5.33332L8 11.4Z'
        fill='currentColor'
      />
    </svg>
  );
};

export type LanguageSelectorGlobeIconProps = ComponentProps<'svg'>;

export const LanguageSelectorGlobeIcon = (props: LanguageSelectorGlobeIconProps) => {
  const { className, ...rest } = props;
  return (
    <svg
      aria-hidden={true}
      className={cx(globeIcon, className)}
      fill='none'
      height='20'
      viewBox='0 0 20 20'
      width='20'
      {...rest}
    >
      <path
        d='M10.0006 17.9166C8.91516 17.9166 7.89086 17.7086 6.92773 17.2924C5.9646 16.8763 5.12458 16.3098 4.40769 15.5929C3.69082 14.876 3.12432 14.036 2.70819 13.0729C2.29205 12.1098 2.08398 11.0855 2.08398 9.99999C2.08398 8.90598 2.29205 7.87954 2.70819 6.92068C3.12432 5.96182 3.69082 5.12394 4.40769 4.40705C5.12458 3.69018 5.9646 3.12368 6.92773 2.70755C7.89086 2.29141 8.91516 2.08334 10.0006 2.08334C11.0946 2.08334 12.1211 2.29141 13.0799 2.70755C14.0388 3.12368 14.8767 3.69018 15.5936 4.40705C16.3104 5.12394 16.8769 5.96182 17.2931 6.92068C17.7092 7.87954 17.9173 8.90598 17.9173 9.99999C17.9173 11.0855 17.7092 12.1098 17.2931 13.0729C16.8769 14.036 16.3104 14.876 15.5936 15.5929C14.8767 16.3098 14.0388 16.8763 13.0799 17.2924C12.1211 17.7086 11.0946 17.9166 10.0006 17.9166ZM10.0006 16.649C10.4259 16.0849 10.7838 15.516 11.0744 14.9423C11.365 14.3686 11.6016 13.7414 11.7843 13.0609H8.21696C8.41034 13.7628 8.64966 14.4006 8.93492 14.9743C9.22017 15.5481 9.57541 16.1063 10.0006 16.649ZM8.38688 16.4199C8.06744 15.9615 7.78057 15.4404 7.5263 14.8566C7.27202 14.2727 7.07437 13.6741 6.93334 13.0609H4.10638C4.54656 13.9263 5.13685 14.6533 5.87723 15.242C6.61764 15.8307 7.45419 16.2233 8.38688 16.4199ZM11.6144 16.4199C12.5471 16.2233 13.3836 15.8307 14.124 15.242C14.8644 14.6533 15.4547 13.9263 15.8949 13.0609H13.0679C12.9002 13.6795 12.6892 14.2807 12.4349 14.8646C12.1806 15.4484 11.9071 15.9669 11.6144 16.4199ZM3.58236 11.8109H6.68013C6.62778 11.5011 6.58986 11.1974 6.56636 10.8998C6.54286 10.6023 6.53111 10.3023 6.53111 9.99999C6.53111 9.69764 6.54286 9.39769 6.56636 9.10014C6.58986 8.80259 6.62778 8.49891 6.68013 8.18907H3.58236C3.50223 8.4722 3.4408 8.76654 3.39807 9.07209C3.35533 9.37765 3.33396 9.68695 3.33396 9.99999C3.33396 10.313 3.35533 10.6223 3.39807 10.9279C3.4408 11.2334 3.50223 11.5278 3.58236 11.8109ZM7.93011 11.8109H12.0712C12.1235 11.5011 12.1614 11.2001 12.1849 10.9078C12.2084 10.6157 12.2202 10.313 12.2202 9.99999C12.2202 9.68695 12.2084 9.38433 12.1849 9.09214C12.1614 8.79993 12.1235 8.49891 12.0712 8.18907H7.93011C7.87776 8.49891 7.83983 8.79993 7.81632 9.09214C7.79282 9.38433 7.78107 9.68695 7.78107 9.99999C7.78107 10.313 7.79282 10.6157 7.81632 10.9078C7.83983 11.2001 7.87776 11.5011 7.93011 11.8109ZM13.3211 11.8109H16.4189C16.499 11.5278 16.5605 11.2334 16.6032 10.9279C16.6459 10.6223 16.6673 10.313 16.6673 9.99999C16.6673 9.68695 16.6459 9.37765 16.6032 9.07209C16.5605 8.76654 16.499 8.4722 16.4189 8.18907H13.3211C13.3735 8.49891 13.4114 8.80259 13.4349 9.10014C13.4584 9.39769 13.4702 9.69764 13.4702 9.99999C13.4702 10.3023 13.4584 10.6023 13.4349 10.8998C13.4114 11.1974 13.3735 11.5011 13.3211 11.8109ZM13.0679 6.93912H15.8949C15.4494 6.06303 14.8631 5.33599 14.136 4.75799C13.409 4.18 12.5685 3.78471 11.6144 3.57209C11.9338 4.05714 12.218 4.58759 12.4669 5.16345C12.7159 5.73931 12.9162 6.3312 13.0679 6.93912ZM8.21696 6.93912H11.7843C11.5909 6.24253 11.3476 5.6007 11.0543 5.01361C10.7611 4.42655 10.4098 3.87232 10.0006 3.35095C9.59144 3.87232 9.24021 4.42655 8.94694 5.01361C8.65367 5.6007 8.41034 6.24253 8.21696 6.93912ZM4.10638 6.93912H6.93334C7.08505 6.3312 7.28537 5.73931 7.53432 5.16345C7.78325 4.58759 8.06744 4.05714 8.38688 3.57209C7.42748 3.78471 6.58559 4.18134 5.86121 4.76201C5.13685 5.34268 4.55191 6.06838 4.10638 6.93912Z'
        fill='currentColor'
        fillOpacity='0.9'
      />
    </svg>
  );
};

export type LanguageSelectorGlobeWithLabelIconProps = ComponentProps<'svg'>;

/** 44px globe icon with a built-in "Language" label, for narrow mobile headers. */
export const LanguageSelectorGlobeWithLabelIcon = (
  props: LanguageSelectorGlobeWithLabelIconProps,
) => {
  const { className, 'aria-label': ariaLabel = 'Language', ...rest } = props;
  return (
    <svg
      aria-label={ariaLabel}
      className={cx(globeIcon, className)}
      fill='none'
      height='44'
      role='img'
      viewBox='0 0 44 44'
      width='44'
      {...rest}
    >
      <path
        d='M22 27.0669C20.3718 27.0669 18.8353 26.7548 17.3906 26.1306C15.9459 25.5064 14.6859 24.6567 13.6106 23.5814C12.5353 22.506 11.6855 21.246 11.0613 19.8013C10.4371 18.3566 10.125 16.8202 10.125 15.192C10.125 13.5509 10.4371 12.0113 11.0613 10.573C11.6855 9.1347 12.5353 7.87788 13.6106 6.80255C14.6859 5.72724 15.9459 4.87749 17.3906 4.2533C18.8353 3.62909 20.3718 3.31699 22 3.31699C23.641 3.31699 25.1806 3.62909 26.6189 4.2533C28.0572 4.87749 29.314 5.72724 30.3894 6.80255C31.4647 7.87788 32.3144 9.1347 32.9386 10.573C33.5628 12.0113 33.8749 13.5509 33.8749 15.192C33.8749 16.8202 33.5628 18.3566 32.9386 19.8013C32.3144 21.246 31.4647 22.506 30.3894 23.5814C29.314 24.6567 28.0572 25.5064 26.6189 26.1306C25.1806 26.7548 23.641 27.0669 22 27.0669ZM22 25.1655C22.6378 24.3194 23.1747 23.466 23.6106 22.6054C24.0465 21.7448 24.4014 20.8041 24.6755 19.7833H19.3245C19.6145 20.8362 19.9735 21.7929 20.4014 22.6535C20.8293 23.5141 21.3621 24.3514 22 25.1655ZM19.5793 24.8218C19.1002 24.1343 18.6699 23.3526 18.2885 22.4768C17.9071 21.601 17.6106 20.7031 17.399 19.7833H13.1586C13.8189 21.0814 14.7043 22.1719 15.8149 23.055C16.9255 23.938 18.1803 24.5269 19.5793 24.8218ZM24.4206 24.8218C25.8196 24.5269 27.0745 23.938 28.1851 23.055C29.2956 22.1719 30.1811 21.0814 30.8413 19.7833H26.6009C26.3493 20.7112 26.0328 21.613 25.6514 22.4888C25.27 23.3646 24.8597 24.1423 24.4206 24.8218ZM12.3726 17.9083H17.0192C16.9407 17.4436 16.8838 16.9881 16.8486 16.5417C16.8133 16.0954 16.7957 15.6455 16.7957 15.192C16.7957 14.7384 16.8133 14.2885 16.8486 13.8422C16.8838 13.3959 16.9407 12.9403 17.0192 12.4756H12.3726C12.2524 12.9003 12.1602 13.3418 12.0961 13.8001C12.032 14.2584 12 14.7224 12 15.192C12 15.6615 12.032 16.1255 12.0961 16.5838C12.1602 17.0421 12.2524 17.4836 12.3726 17.9083ZM18.8942 17.9083H25.1058C25.1843 17.4436 25.2412 16.9921 25.2764 16.5537C25.3117 16.1154 25.3293 15.6615 25.3293 15.192C25.3293 14.7224 25.3117 14.2685 25.2764 13.8302C25.2412 13.3919 25.1843 12.9403 25.1058 12.4756H18.8942C18.8157 12.9403 18.7588 13.3919 18.7235 13.8302C18.6883 14.2685 18.6706 14.7224 18.6706 15.192C18.6706 15.6615 18.6883 16.1154 18.7235 16.5537C18.7588 16.9921 18.8157 17.4436 18.8942 17.9083ZM26.9807 17.9083H31.6274C31.7476 17.4836 31.8397 17.0421 31.9038 16.5838C31.9679 16.1255 32 15.6615 32 15.192C32 14.7224 31.9679 14.2584 31.9038 13.8001C31.8397 13.3418 31.7476 12.9003 31.6274 12.4756H26.9807C27.0592 12.9403 27.1161 13.3959 27.1514 13.8422C27.1866 14.2885 27.2043 14.7384 27.2043 15.192C27.2043 15.6455 27.1866 16.0954 27.1514 16.5417C27.1161 16.9881 27.0592 17.4436 26.9807 17.9083ZM26.6009 10.6006H30.8413C30.1731 9.28652 29.2936 8.19596 28.2031 7.32896C27.1125 6.46198 25.8517 5.86903 24.4206 5.55011C24.8998 6.27767 25.326 7.07335 25.6994 7.93714C26.0729 8.80094 26.3733 9.68877 26.6009 10.6006ZM19.3245 10.6006H24.6755C24.3854 9.55577 24.0204 8.59302 23.5805 7.71239C23.1406 6.83179 22.6138 6.00046 22 5.21839C21.3862 6.00046 20.8593 6.83179 20.4194 7.71239C19.9795 8.59302 19.6145 9.55577 19.3245 10.6006ZM13.1586 10.6006H17.399C17.6266 9.68877 17.9271 8.80094 18.3005 7.93714C18.6739 7.07335 19.1002 6.27767 19.5793 5.55011C18.1402 5.86903 16.8774 6.46399 15.7908 7.33499C14.7043 8.20599 13.8269 9.29454 13.1586 10.6006Z'
        fill='currentColor'
      />
      <path
        d='M34.0409 35.272H37.1369V39.544C36.6809 39.696 36.2129 39.808 35.7329 39.88C35.2609 39.96 34.7209 40 34.1129 40C33.2409 40 32.5009 39.824 31.8929 39.472C31.2929 39.12 30.8329 38.616 30.5129 37.96C30.2009 37.304 30.0449 36.516 30.0449 35.596C30.0449 34.7 30.2209 33.924 30.5729 33.268C30.9249 32.612 31.4289 32.104 32.0849 31.744C32.7489 31.376 33.5529 31.192 34.4969 31.192C34.9689 31.192 35.4209 31.24 35.8529 31.336C36.2849 31.424 36.6849 31.548 37.0529 31.708L36.5849 32.788C36.2889 32.652 35.9569 32.54 35.5889 32.452C35.2289 32.356 34.8489 32.308 34.4489 32.308C33.8169 32.308 33.2689 32.444 32.8049 32.716C32.3489 32.98 31.9969 33.36 31.7489 33.856C31.5089 34.344 31.3889 34.928 31.3889 35.608C31.3889 36.248 31.4889 36.816 31.6889 37.312C31.8889 37.808 32.2049 38.196 32.6369 38.476C33.0689 38.756 33.6329 38.896 34.3289 38.896C34.5609 38.896 34.7649 38.888 34.9409 38.872C35.1169 38.848 35.2769 38.824 35.4209 38.8C35.5729 38.768 35.7169 38.74 35.8529 38.716V36.388H34.0409V35.272Z'
        fill='currentColor'
      />
      <path
        d='M28.1804 39.88H26.6084L22.2764 32.956H22.2284C22.2364 33.116 22.2444 33.288 22.2524 33.472C22.2684 33.656 22.2804 33.852 22.2884 34.06C22.2964 34.26 22.3044 34.468 22.3124 34.684C22.3204 34.892 22.3244 35.104 22.3244 35.32V39.88H21.1484V31.312H22.7084L27.0284 38.2H27.0644C27.0564 38.08 27.0484 37.932 27.0404 37.756C27.0324 37.572 27.0244 37.376 27.0164 37.168C27.0164 36.96 27.0124 36.748 27.0044 36.532C26.9964 36.316 26.9884 36.112 26.9804 35.92V31.312H28.1804V39.88Z'
        fill='currentColor'
      />
      <path
        d='M18.6363 39.88L17.7242 37.408H14.4123L13.5002 39.88H12.1562L15.4083 31.276H16.7523L19.9923 39.88H18.6363ZM16.5002 33.868C16.4762 33.78 16.4323 33.648 16.3682 33.472C16.3123 33.288 16.2563 33.104 16.2003 32.92C16.1443 32.728 16.1002 32.572 16.0682 32.452C16.0282 32.612 15.9802 32.788 15.9242 32.98C15.8762 33.164 15.8283 33.336 15.7803 33.496C15.7323 33.648 15.6923 33.772 15.6603 33.868L14.7963 36.28H17.3643L16.5002 33.868Z'
        fill='currentColor'
      />
      <path d='M6.86328 39.88V31.312H8.15928V38.764H11.8193V39.88H6.86328Z' fill='currentColor' />
    </svg>
  );
};
