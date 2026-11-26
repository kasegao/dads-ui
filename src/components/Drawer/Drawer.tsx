import type { ComponentProps } from 'react';
import { css, cva, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

export type DrawerPlacement = 'left' | 'right' | 'full';

const drawer = cva({
  base: {
    margin: '0',
    maxWidth: 'full',
    maxHeight: 'none',
    height: '100dvh',
    borderWidth: '0',
    backgroundColor: 'white',
    padding: '0',
    color: 'solid-gray.800',
    textStyle: 'std-16N-170',
    _open: {
      display: 'grid',
      gridTemplate: '"header" auto "body" 1fr / 1fr',
    },
    _backdrop: {
      backgroundColor: 'opacity-gray.100',
      _forcedColors: { backgroundColor: '#000b' },
    },
    _motionSafe: {
      transitionProperty: 'translate, overlay, display',
      transitionDuration: '0.2s',
      transitionTimingFunction: 'ease-out',
      transitionBehavior: 'allow-discrete',
      '&:not([open])': { translate: 'var(--drawer-offset, 0)' },
      _open: { _starting: { translate: 'var(--drawer-offset, 0)' } },
    },
  },
  variants: {
    placement: {
      right: {
        '--drawer-offset': '100%',
        left: 'auto',
        width: '18rem',
        boxShadow: '2',
        borderLeftWidth: '1',
        borderLeftStyle: 'solid',
        borderLeftColor: 'transparent',
      },
      left: {
        '--drawer-offset': '-100%',
        right: 'auto',
        width: '18rem',
        boxShadow: '2',
        borderRightWidth: '1',
        borderRightStyle: 'solid',
        borderRightColor: 'transparent',
      },
      full: { width: 'full' },
    },
  },
  defaultVariants: { placement: 'right' },
});

const header = css({
  display: 'flex',
  gridArea: 'header',
  justifyContent: 'flex-end',
  paddingBlock: '20',
  paddingInline: '16',
  '[data-placement=left] > &': { justifyContent: 'flex-start' },
});

const heading = css({ srOnly: true });

const body = css({
  gridArea: 'body',
  overflow: 'auto',
  overscrollBehavior: 'contain',
  scrollbarGutter: 'stable',
});

const menuButton = css({
  display: 'flex',
  alignItems: 'center',
  columnGap: '4',
  width: 'fit',
  borderRadius: '6',
  paddingTop: '4',
  paddingInline: '12',
  paddingBottom: '6',
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

const icon = css({ flex: 'none', marginTop: '2' });

export type DrawerProps = ComponentProps<'dialog'> & {
  /** Side the panel is attached to; `full` covers the viewport. */
  placement?: DrawerPlacement;
};

export const Drawer = (props: DrawerProps) => {
  const { className, placement = 'right', ...rest } = props;

  return (
    <dialog className={cx(drawer({ placement }), className)} data-placement={placement} {...rest} />
  );
};

export type DrawerHeaderProps = ComponentProps<'div'>;

export const DrawerHeader = ({ className, ...rest }: DrawerHeaderProps) => (
  <div className={cx(header, className)} {...rest} />
);

export type DrawerHeadingProps = ComponentProps<'h2'>;

/** Visually hidden heading that names the drawer (`aria-labelledby`). */
export const DrawerHeading = ({ className, ...rest }: DrawerHeadingProps) => (
  <h2 className={cx(heading, className)} {...rest} />
);

export type DrawerBodyProps = ComponentProps<'div'>;

export const DrawerBody = ({ className, ...rest }: DrawerBodyProps) => (
  <div className={cx(body, className)} {...rest} />
);

export type DrawerTriggerProps = ComponentProps<'button'>;

export const DrawerTrigger = (props: DrawerTriggerProps) => {
  const { className, children = 'メニュー', ...rest } = props;

  return (
    <button className={cx(menuButton, className)} type='button' {...rest}>
      <svg className={icon} width='24' height='24' viewBox='0 0 24 24' aria-hidden='true'>
        <path d='M3 18V16H21V18H3ZM3 13V11H21V13H3ZM3 8V6H21V8H3Z' fill='currentColor' />
      </svg>
      {children}
    </button>
  );
};

export type DrawerCloseProps = ComponentProps<'button'>;

export const DrawerClose = (props: DrawerCloseProps) => {
  const { className, children = '閉じる', ...rest } = props;

  return (
    <button className={cx(menuButton, className)} type='button' {...rest}>
      <svg className={icon} width='24' height='24' viewBox='0 0 120 120' aria-hidden='true'>
        <path
          d='M32 95L25 88L53 60L25 32L32 25L60 53L88 25L95 32L67 60L95 88L88 95L60 67L32 95Z'
          fill='currentColor'
        />
      </svg>
      {children}
    </button>
  );
};
