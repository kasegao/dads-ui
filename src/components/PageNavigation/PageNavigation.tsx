import type { ComponentProps, ReactNode } from 'react';
import { css, cva, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';
import { Slot } from '../../utils/Slot';
import { Button, type ButtonProps } from '../Button';

const pageNavigation = css({
  display: 'flex',
  alignItems: 'center',
  gap: '16',
  color: 'solid-gray.800',
  textStyle: 'oln-16N-100',
});

const pageNavigationCounter = css({
  minWidth: '3.75rem',
  color: 'solid-gray.900',
  textStyle: 'oln-16N-100',
  textAlign: 'center',
  whiteSpace: 'nowrap',
});

/** Tightens the icon side (text) or widens the label side (outline) of a prev/next button. */
const pageNavigationButton = cva({
  base: { '& > svg': { flexShrink: '0' } },
  variants: {
    variant: { text: {}, outline: {}, 'solid-fill': {} },
    control: { prev: {}, next: {} },
  },
  compoundVariants: [
    { variant: 'text', control: 'prev', css: { paddingLeft: '8' } },
    { variant: 'text', control: 'next', css: { paddingRight: '8' } },
    { variant: 'outline', control: 'prev', css: { paddingRight: '24' } },
    { variant: 'outline', control: 'next', css: { paddingLeft: '24' } },
  ],
});

/** Expands the hit area of small arrow buttons to 44px (WCAG 2.5.8). */
const targetSize = {
  position: 'relative',
  _after: {
    content: '""',
    position: 'absolute',
    inset: '-100%',
    margin: 'auto',
    width: '44',
    height: '44',
  },
} as const;

const pageNavigationArrowButton = cva({
  base: {
    display: 'flex',
    flexShrink: '0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'currentColor',
    borderRadius: 'full',
    backgroundColor: 'white',
    color: 'key.1000',
    cursor: 'pointer',
    _hover: { backgroundColor: 'key.200' },
    _active: { backgroundColor: 'key.300', color: 'key.1200' },
    _focusVisible: { ...focusRing },
  },
  variants: {
    size: {
      lg: {
        width: '44',
        height: '44',
        _hover: { borderWidth: '3px' },
        '& svg': { width: '24', height: '24' },
      },
      md: {
        ...targetSize,
        width: '32',
        height: '32',
        _hover: { borderWidth: '3px' },
        '& svg': { width: '20', height: '20' },
      },
      sm: {
        ...targetSize,
        width: '24',
        height: '24',
        _hover: { borderWidth: '2px' },
        '& svg': { width: '16', height: '16' },
      },
      xs: {
        ...targetSize,
        width: '20',
        height: '20',
        _hover: { borderWidth: '2px' },
        '& svg': { width: '16', height: '16' },
      },
    },
  },
});

const srOnly = css({ srOnly: true });

export type PageNavigationProps = ComponentProps<'nav'>;

export const PageNavigation = (props: PageNavigationProps) => {
  const { children, className, ...rest } = props;
  return (
    <nav className={cx(pageNavigation, className)} {...rest}>
      {children}
    </nav>
  );
};

export type PageNavigationCounterProps = ComponentProps<'span'>;

export const PageNavigationCounter = (props: PageNavigationCounterProps) => {
  const { children, className, ...rest } = props;
  return (
    <span className={cx(pageNavigationCounter, className)} {...rest}>
      {children}
    </span>
  );
};

export type PageNavigationControl = 'prev' | 'next';
export type PageNavigationButtonProps = ButtonProps & {
  /** Which side the arrow icon sits on. */
  control: PageNavigationControl;
};

/** A prev/next `Button` whose padding is adjusted to balance its arrow icon. */
export const PageNavigationButton = (props: PageNavigationButtonProps) => {
  const { className, control, variant, ...rest } = props;

  return (
    <Button
      className={cx(pageNavigationButton({ control, variant }), className)}
      data-control={control}
      variant={variant}
      {...(rest as ButtonProps)}
    />
  );
};

export type PageNavigationArrowButtonSize = 'lg' | 'md' | 'sm' | 'xs';

export type PageNavigationArrowButtonProps = {
  className?: string;
  size: PageNavigationArrowButtonSize;
} & (
  | ({
      asChild?: false;
      /** Accessible name, rendered as visually hidden text (e.g. `前のページ`). */
      label: string;
    } & ComponentProps<'button'>)
  | { asChild: true; children: ReactNode }
);

export const PageNavigationArrowButton = (props: PageNavigationArrowButtonProps) => {
  if (props.asChild) {
    const { asChild: _asChild, children, className, size, ...rest } = props;
    return (
      <Slot className={cx(pageNavigationArrowButton({ size }), className)} {...rest}>
        {children}
      </Slot>
    );
  }

  const { asChild: _asChild, children, className, label, size, type = 'button', ...rest } = props;

  return (
    <button className={cx(pageNavigationArrowButton({ size }), className)} type={type} {...rest}>
      {children}
      <span className={srOnly}>{label}</span>
    </button>
  );
};
