import type { ComponentProps, CSSProperties } from 'react';
import { css, cva, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

export type ModalDialogScroll = 'inner' | 'outer';

const spacer = {
  content: '""',
  display: 'block',
  flexShrink: '9999',
  width: '1px',
  height: '120',
  minHeight: '16',
} as const;

const dialog = cva({
  base: {
    inset: '0',
    containerType: 'inline-size',
    width: 'auto',
    height: 'auto',
    maxWidth: 'none',
    maxHeight: 'none',
    borderWidth: '0',
    backgroundColor: 'transparent',
    paddingBlock: '0',
    paddingInline: '16',
    textStyle: 'std-16N-170',
    overflowWrap: 'break-word',
    colorScheme: 'dark',
    '&:modal': { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    _before: spacer,
    _after: spacer,
    _backdrop: {
      backgroundColor: 'opacity-gray.600',
      _forcedColors: { backgroundColor: '#000b' },
    },
  },
  variants: {
    scroll: {
      outer: { scrollbarGutter: 'stable' },
      inner: { scrollbarGutter: 'auto' },
    },
  },
  defaultVariants: { scroll: 'outer' },
});

const content = css({
  display: 'flex',
  flexDirection: 'column',
  rowGap: { base: '12', desktop: '16' },
  flexShrink: '0',
  width: 'var(--modal-dialog-width, fit-content)',
  minWidth: 'min(30rem, calc(100cqw - 2rem))',
  maxWidth: 'full',
  minHeight: '0',
  borderRadius: '8',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'black',
  backgroundColor: 'white',
  boxShadow: '3',
  color: 'solid-gray.800',
  colorScheme: 'light',
  'dialog[data-scroll=inner] > &': {
    flexShrink: '1',
    scrollbarWidth: 'thin',
    '&:not(:has([data-modal-dialog-scroll-area]))': { overflowY: 'auto' },
  },
});

const header = css({
  display: 'flex',
  alignItems: 'flex-start',
  flexShrink: '0',
  columnGap: '16',
  minWidth: '0',
  paddingTop: { base: '8', desktop: '24' },
  paddingInline: { base: '16', desktop: '24' },
});

const heading = css({
  flexGrow: '1',
  minWidth: '0',
  textStyle: { base: 'std-24B-150', desktop: 'std-28B-150' },
  _focusVisible: { outlineStyle: 'none', borderRadius: '0', boxShadow: 'none' },
});

const close = css({
  display: 'flex',
  alignItems: 'center',
  flexShrink: '0',
  columnGap: '4',
  width: 'fit',
  borderRadius: '6',
  paddingTop: '4',
  paddingInline: '12',
  paddingBottom: '6',
  color: 'solid-gray.800',
  textStyle: 'oln-16N-100',
  touchAction: 'manipulation',
  cursor: 'pointer',
  _hover: {
    backgroundColor: 'solid-gray.50',
    textDecorationLine: 'underline',
    textUnderlineOffset: '0.1875rem',
  },
  _focusVisible: { ...focusRing, backgroundColor: 'yellow.300' },
});

const closeIcon = css({
  marginTop: '2',
  width: '24',
  height: '24',
  flexShrink: '0',
  color: 'black',
  _forcedColors: { color: 'currentColor' },
});

const body = css({
  flexShrink: '0',
  minWidth: '0',
  paddingInline: { base: '16', desktop: '24' },
  paddingBottom: '32',
});

const actions = css({
  flexShrink: '0',
  minWidth: '0',
  paddingInline: { base: '16', desktop: '24' },
  paddingBottom: { base: '16', desktop: '24' },
});

const scrollArea = css({
  display: 'flex',
  flexDirection: 'column',
  rowGap: { base: '12', desktop: '16' },
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  '&:not(:first-child)': {
    marginTop: { base: '-0.25rem', desktop: '8' },
    borderTopWidth: '1',
    borderTopStyle: 'solid',
    borderTopColor: 'solid-gray.600',
  },
  '&:not(:last-child)': {
    marginBottom: { base: '4', desktop: '8' },
    borderBottomWidth: '1',
    borderBottomStyle: 'solid',
    borderBottomColor: 'solid-gray.600',
  },
});

export type ModalDialogProps = ComponentProps<'dialog'> & {
  /** `inner` scrolls inside the panel; `outer` (default) scrolls the whole dialog. */
  scroll?: ModalDialogScroll;
  /** Panel width as a CSS length (`'800px'`, `'100%'`). Defaults to `fit-content`. */
  width?: string;
};

export const ModalDialog = (props: ModalDialogProps) => {
  const { children, className, scroll, width, style, ...rest } = props;
  const mergedStyle = width
    ? ({ ...style, '--modal-dialog-width': width } as CSSProperties)
    : style;

  return (
    <dialog
      className={cx(dialog({ scroll }), className)}
      data-scroll={scroll}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </dialog>
  );
};

export type ModalDialogContentProps = ComponentProps<'div'>;

export const ModalDialogContent = ({ className, ...rest }: ModalDialogContentProps) => (
  <div className={cx(content, className)} {...rest} />
);

export type ModalDialogHeaderProps = ComponentProps<'div'>;

export const ModalDialogHeader = ({ className, ...rest }: ModalDialogHeaderProps) => (
  <div className={cx(header, className)} {...rest} />
);

export type ModalDialogHeadingProps = ComponentProps<'h2'>;

export const ModalDialogHeading = (props: ModalDialogHeadingProps) => {
  const { className, tabIndex = -1, ...rest } = props;

  return <h2 className={cx(heading, className)} tabIndex={tabIndex} {...rest} />;
};

export type ModalDialogCloseProps = Omit<ComponentProps<'button'>, 'children'>;

export const ModalDialogClose = ({ className, ...rest }: ModalDialogCloseProps) => (
  <button className={cx(close, className)} type='button' {...rest}>
    <svg className={closeIcon} width='24' height='24' viewBox='0 0 120 120' aria-hidden='true'>
      <path
        d='M32 95L25 88L53 60L25 32L32 25L60 53L88 25L95 32L67 60L95 88L88 95L60 67L32 95Z'
        fill='currentColor'
      />
    </svg>
    閉じる
  </button>
);

export type ModalDialogBodyProps = ComponentProps<'div'>;

export const ModalDialogBody = ({ className, ...rest }: ModalDialogBodyProps) => (
  <div className={cx(body, className)} {...rest} />
);

export type ModalDialogActionsProps = ComponentProps<'div'>;

export const ModalDialogActions = ({ className, ...rest }: ModalDialogActionsProps) => (
  <div className={cx(actions, className)} {...rest} />
);

export type ModalDialogScrollAreaProps = ComponentProps<'div'>;

export const ModalDialogScrollArea = ({ className, ...rest }: ModalDialogScrollAreaProps) => (
  <div className={cx(scrollArea, className)} data-modal-dialog-scroll-area='' {...rest} />
);
