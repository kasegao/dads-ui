import {
  type ComponentProps,
  type CSSProperties,
  cloneElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { css, cva, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';
import { Slot } from '../../utils/Slot';

export type StepNavigationOrientation = 'horizontal' | 'vertical';
export type StepNavigationSize = 'normal' | 'small';
export type StepNavigationStepState = 'reached' | 'completed' | 'editing' | 'error' | 'skipped';

const stepNavigation = cva({
  base: {
    isolation: 'isolate',
    color: 'solid-gray.800',
    textStyle: 'std-16N-170',
    overflowWrap: 'anywhere',
  },
  variants: {
    orientation: {
      horizontal: { overflowX: 'auto', paddingBlock: '6' },
      vertical: {},
    },
    size: {
      normal: {
        '--step-number-size': '2.75rem',
        '--step-number-margin': '0.25rem',
        '--step-outline-width': '0.125rem',
        '--step-title-margin': '1.5rem',
        '--step-description-margin': '0.5rem',
      },
      small: {
        '--step-number-size': '2rem',
        '--step-number-margin': '0.1875rem',
        '--step-outline-width': '0.0625rem',
        '--step-title-margin': '1rem',
        '--step-description-margin': '0.25rem',
      },
    },
  },
});

const stepNavigationList = css({
  display: 'flex',
  '[data-step-navigation][data-orientation=vertical] &': { flexDirection: 'column' },
});

const stepNavigationStep = css({
  position: 'relative',
  // Connector lines to the previous (::before) and next (::after) step.
  _before: { content: '""', position: 'absolute', zIndex: '-1' },
  _after: { content: '""', position: 'absolute', zIndex: '-1' },
  '&[data-first]::before': { display: 'none' },
  '&[data-last]::after': { display: 'none' },
  '[data-step-navigation][data-orientation=horizontal] &': {
    width: 'calc(var(--step-width, 320) / 16 * 1rem)',
    minWidth: 'calc(var(--step-min-width, 160) / 16 * 1rem)',
    paddingInline: '16',
    _before: {
      top: 'calc(var(--step-number-size) / 2 + var(--step-number-margin))',
      right: '50%',
      width: '50%',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'currentColor',
    },
    _after: {
      top: 'calc(var(--step-number-size) / 2 + var(--step-number-margin))',
      left: '50%',
      width: '50%',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'currentColor',
    },
  },
  '[data-step-navigation][data-orientation=vertical] &': {
    flex: '1',
    paddingBottom: '24',
    _last: { paddingBottom: '0' },
    _before: {
      top: '0',
      left: 'calc(var(--step-number-size) / 2 + var(--step-number-margin))',
      height: '32',
      borderRightWidth: '1px',
      borderRightStyle: 'solid',
      borderRightColor: 'currentColor',
    },
    _after: {
      bottom: '0',
      left: 'calc(var(--step-number-size) / 2 + var(--step-number-margin))',
      height: 'calc(100% - 2rem)',
      borderRightWidth: '1px',
      borderRightStyle: 'solid',
      borderRightColor: 'currentColor',
    },
  },
});

const stepNavigationStepHeader = css({
  display: 'block',
  textWrap: 'pretty',
  // The focus indicator is drawn on the number instead.
  _focusVisible: { outlineStyle: 'none', boxShadow: 'none' },
  '&[data-interactive]': {
    textDecorationLine: 'underline',
    textDecorationThickness: '1px',
    textUnderlineOffset: '0.1875rem',
    _hover: { textDecorationThickness: '0.1875rem', cursor: 'pointer' },
  },
  '[data-step-navigation][data-orientation=horizontal] &': {
    width: 'full',
    textAlign: 'center',
  },
  '[data-step-navigation][data-orientation=vertical] &': {
    position: 'relative',
    display: 'flex',
    alignItems: 'baseline',
    columnGap: '16',
    textAlign: 'left',
  },
});

const stepNavigationNumber = css({
  position: 'relative',
  display: 'grid',
  placeContent: 'center',
  width: 'fit',
  height: 'var(--step-number-size)',
  minWidth: 'var(--step-number-size)',
  margin: 'var(--step-number-margin)',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: 'currentColor',
  borderRadius: 'full',
  backgroundColor: 'white',
  paddingInline: '2',
  paddingBottom: '2',
  textStyle: 'std-20B-150',
  textDecoration: 'inherit',
  textDecorationThickness: 'inherit',
  '[data-step-navigation][data-size=small] &': { borderWidth: '1px', fontSize: '1rem' },
  '[data-step-navigation][data-orientation=horizontal] &': { marginInline: 'auto' },
  '[data-step-navigation][data-orientation=vertical] &': { flexShrink: '0' },
  '[data-step][data-state=reached] &': {
    borderColor: 'solid-gray.800',
    backgroundColor: 'solid-gray.800',
    color: 'white',
    _forcedColors: {
      backgroundColor: 'CanvasText',
      color: 'Canvas',
      forcedColorAdjust: 'none',
    },
  },
  '[data-step][data-state=completed] &': { backgroundColor: 'solid-gray.50' },
  '[data-step][data-state=error] &': { color: 'error.1' },
  '[data-step][data-state=skipped] &': { borderWidth: '1px', borderStyle: 'dashed' },
  '[data-step][data-current] &': {
    outlineWidth: 'var(--step-outline-width)',
    outlineStyle: 'solid',
    outlineColor: 'solid-gray.800',
    outlineOffset: '2px',
    boxShadow: '0 0 0 {spacing.2} {colors.white}',
  },
  '[data-interactive]:hover:not(:focus-visible) &': {
    outlineWidth: '1px',
    outlineStyle: 'solid',
    outlineColor: 'currentColor',
  },
  '[data-step][data-state=reached] [data-interactive]:hover:not(:focus-visible) &': {
    outlineColor: 'solid-gray.800',
  },
  '[data-step][data-state=skipped] [data-interactive]:hover:not(:focus-visible) &': {
    outlineStyle: 'none',
    borderWidth: '2px',
  },
  '[data-step] [data-step-header]:focus-visible &': { ...focusRing },
});

const stateIcon = css({
  position: 'absolute',
  top: '-0.625rem',
  left: 'calc(50% + 0.375rem)',
  borderRadius: 'full',
  backgroundColor: 'white',
  '& > svg': {
    display: 'block',
    maxWidth: 'none',
    '[data-step-navigation][data-size=small] &': { width: '20', height: '20' },
  },
  '[data-step-navigation][data-size=small] &': {
    top: '-0.5625rem',
    left: 'calc(50% + 0.25rem)',
  },
});

const stateLabel = css({
  position: 'absolute',
  top: 'calc(100% + 0.5rem)',
  bottom: '0',
  insetInline: '-100%',
  marginInline: 'auto',
  width: '4em',
  height: '1.2em',
  backgroundColor: 'white',
  textStyle: 'dns-14N-120',
  textAlign: 'center',
});

const forcedCanvasText = css({ _forcedColors: { fill: 'CanvasText' } });
const forcedCanvas = css({ _forcedColors: { fill: 'Canvas' } });

const stepNavigationTitle = css({
  display: 'block',
  textStyle: 'std-18B-160',
  textDecorationThickness: 'inherit',
  '[data-step-navigation][data-size=small] &': { textStyle: 'std-16B-170' },
  '[data-step-navigation][data-orientation=horizontal] &': {
    marginTop: 'var(--step-title-margin)',
  },
  '[data-step-navigation][data-orientation=vertical] &': {
    paddingBlock: 'calc(var(--step-number-size) / 2 + var(--step-number-margin) - 0.875rem)',
  },
});

const stepNavigationDescription = css({
  marginTop: 'var(--step-description-margin)',
  '[data-step-navigation][data-orientation=horizontal] &': { textAlign: 'center' },
  '[data-step-navigation][data-orientation=vertical] &': {
    marginTop:
      'calc(var(--step-description-margin) - (var(--step-number-size) / 2 + var(--step-number-margin) - 0.875rem))',
    paddingLeft: 'calc(var(--step-number-size) + var(--step-number-margin) * 2 + 1rem)',
  },
});

const srOnly = css({ srOnly: true });

export type StepNavigationProps = {
  orientation?: StepNavigationOrientation;
  size?: StepNavigationSize;
  className?: string;
  /** Set `--step-width` / `--step-min-width` (unitless px) to size horizontal steps. */
  style?: CSSProperties;
} & (({ asChild?: false } & ComponentProps<'div'>) | { asChild: true; children: ReactElement });

export const StepNavigation = (props: StepNavigationProps) => {
  const {
    asChild,
    orientation = 'horizontal',
    size = 'normal',
    children,
    className,
    ...rest
  } = props;
  const Component = asChild ? Slot : 'div';

  return (
    <Component
      className={cx(stepNavigation({ orientation, size }), className)}
      data-step-navigation=''
      data-orientation={orientation}
      data-size={size}
      {...rest}
    >
      {children}
    </Component>
  );
};

export type StepNavigationListProps = ComponentProps<'ul'>;

export const StepNavigationList = (props: StepNavigationListProps) => {
  const { children, className, ...rest } = props;
  return (
    <ul className={cx(stepNavigationList, className)} {...rest}>
      {children}
    </ul>
  );
};

export type StepNavigationStepProps = ComponentProps<'li'> & {
  state?: StepNavigationStepState;
  /** First step: hides the connector to the previous step. */
  first?: boolean;
  /** Last step: hides the connector to the next step. */
  last?: boolean;
};

export const StepNavigationStep = (props: StepNavigationStepProps) => {
  const { state, first, last, children, className, 'aria-current': ariaCurrent, ...rest } = props;
  const isCurrent = ariaCurrent != null && ariaCurrent !== false && ariaCurrent !== 'false';

  return (
    <li
      className={cx(stepNavigationStep, className)}
      data-step=''
      data-state={state}
      data-first={first ? '' : undefined}
      data-last={last ? '' : undefined}
      data-current={isCurrent ? '' : undefined}
      aria-current={ariaCurrent}
      {...rest}
    >
      {children}
    </li>
  );
};

export type StepNavigationStepHeaderProps = {
  className?: string;
} & (({ asChild?: false } & ComponentProps<'span'>) | { asChild: true; children: ReactElement });

type InteractiveChildProps = { children?: ReactNode; disabled?: boolean };

export const StepNavigationStepHeader = (props: StepNavigationStepHeaderProps) => {
  const { asChild, children, className, ...rest } = props;
  const classNames = cx(stepNavigationStepHeader, className);
  const prefix = <span className={srOnly}>ステップ</span>;

  if (asChild) {
    const child = children as ReactElement<InteractiveChildProps>;
    const isDisabled = child.props.disabled === true;

    return (
      <Slot
        className={classNames}
        data-step-header=''
        data-interactive={isDisabled ? undefined : ''}
        {...rest}
      >
        {cloneElement(
          child,
          {},
          <>
            {prefix}
            {child.props.children}
          </>,
        )}
      </Slot>
    );
  }

  return (
    <span className={classNames} data-step-header='' {...rest}>
      {prefix}
      {children}
    </span>
  );
};

export type StepNavigationNumberProps = ComponentProps<'span'>;

export const StepNavigationNumber = (props: StepNavigationNumberProps) => {
  const { children, className, ...rest } = props;
  return (
    <span className={cx(stepNavigationNumber, className)} {...rest}>
      {children}
    </span>
  );
};

const CompletedIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' aria-hidden={true}>
    <circle cx='12' cy='12' r='12' fill='#666' className={forcedCanvasText} />
    <path
      d='M10 17.5 19.8 8l-1.5-1.5-8.1 8-4.1-4L4.5 12l5.6 5.5Z'
      fill='#fff'
      className={forcedCanvas}
    />
  </svg>
);

const EditingIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' aria-hidden={true}>
    <path
      d='M5.8 20c-.5 0-1-.2-1.3-.5-.3-.4-.5-.8-.5-1.3V5.6c0-.5.2-.9.5-1.3.4-.3.8-.5 1.3-.5h8L12 5.6H5.8v12.6h12.6V12l1.8-1.8v8c0 .5-.2 1-.5 1.3-.4.3-.8.5-1.3.5H5.8Zm3.6-5.4v-3.8l8.3-8.3a1.8 1.8 0 0 1 2.5 0l1.3 1.3.4.6a1.7 1.7 0 0 1 0 1.3c-.1.3-.2.5-.4.6l-8.3 8.3H9.4Zm1.8-1.8h1.3l5.2-5.2L17 7l-.7-.7-5.2 5.2v1.3Z'
      fill='#333'
      className={forcedCanvasText}
    />
  </svg>
);

const ErrorIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' aria-hidden={true}>
    <path
      d='M1 21 12 2l11 19H1Zm3.5-2h15L12 6 4.5 19Zm7.5-1c.3 0 .5-.1.7-.3.2-.2.3-.4.3-.7a1 1 0 0 0-.3-.7 1 1 0 0 0-.7-.3 1 1 0 0 0-.7.3 1 1 0 0 0-.3.7c0 .3.1.5.3.7.2.2.4.3.7.3Zm-1-3h2v-5h-2v5Z'
      fill='#ec0000'
      className={forcedCanvasText}
    />
  </svg>
);

export type StepNavigationStateIndicatorProps = ComponentProps<'span'> & {
  /** Pass the same value as the parent `StepNavigationStep`. */
  state?: StepNavigationStepState;
};

/** State icon and label for a step. Place it inside `StepNavigationNumber`. */
export const StepNavigationStateIndicator = (props: StepNavigationStateIndicatorProps) => {
  const { state, ...rest } = props;

  return (
    <span {...rest}>
      {state === 'completed' && (
        <>
          <span className={stateIcon}>
            <CompletedIcon />
          </span>
          <span className={srOnly}>完了</span>
        </>
      )}
      {state === 'editing' && (
        <>
          <span className={stateIcon}>
            <EditingIcon />
          </span>
          <span className={stateLabel}>編集中</span>
        </>
      )}
      {state === 'error' && (
        <>
          <span className={stateIcon}>
            <ErrorIcon />
          </span>
          <span className={stateLabel}>エラー</span>
        </>
      )}
      {state === 'skipped' && <span className={srOnly}>スキップされました</span>}
    </span>
  );
};

export type StepNavigationTitleProps = ComponentProps<'span'>;

export const StepNavigationTitle = (props: StepNavigationTitleProps) => {
  const { children, className, ...rest } = props;
  return (
    <span className={cx(stepNavigationTitle, className)} {...rest}>
      {children}
    </span>
  );
};

export type StepNavigationDescriptionProps = ComponentProps<'p'>;

export const StepNavigationDescription = (props: StepNavigationDescriptionProps) => {
  const { children, className, ...rest } = props;
  return (
    <p className={cx(stepNavigationDescription, className)} {...rest}>
      {children}
    </p>
  );
};
