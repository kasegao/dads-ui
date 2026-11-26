import type { ComponentProps, CSSProperties } from 'react';
import { css, cva, cx } from '../../../styled-system/css';

export type ProgressIndicatorType = 'stacked' | 'inlined' | 'stacked-underlay';
export type ProgressIndicatorSize = 'lg' | 'sm';

const root = cva({
  base: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: '16',
    columnGap: '8',
    color: 'solid-gray.900',
    textStyle: 'std-16N-170',
  },
  variants: {
    type: {
      inlined: {},
      stacked: { flexDirection: 'column' },
      'stacked-underlay': {
        flexDirection: 'column',
        marginInline: 'auto',
        width: 'fit',
        borderRadius: '16',
        borderWidth: '1',
        borderStyle: 'solid',
        borderColor: 'solid-gray.500',
        backgroundColor: 'white',
        '&:has([data-indicator=spinner], [data-indicator=static])': {
          minWidth: '8rem',
          minHeight: '8rem',
          padding: '16',
        },
        '&:has([data-indicator=linear])': { padding: '24' },
      },
    },
  },
});

const track = css({ color: 'key.100', _forcedColors: { color: 'Canvas' } });
const bar = css({ color: 'key.1200', _forcedColors: { color: 'CanvasText' } });

const spinnerOuter = css({
  transformOrigin: 'center',
  '[role=progressbar][data-indeterminate] &': {
    animation: 'dads-spinner-rotate 13s linear infinite',
    _motionReduce: { animation: 'none' },
  },
});

const spinnerInner = css({
  transformOrigin: 'center',
  '[role=progressbar][data-indeterminate] &': {
    animation: 'dads-spinner-group-rotate 2.5s linear infinite',
    _motionReduce: { animation: 'none' },
  },
});

const spinnerBar = css({
  transform: 'rotate(-90deg)',
  transformOrigin: 'center',
  strokeDasharray: '100',
  strokeDashoffset: 'calc(100 - clamp(0, var(--value, 35), 100))',
  '[role=progressbar][data-indeterminate] &': {
    animation:
      'dads-spinner-bar-rotate 2.5s cubic-bezier(0.4, 0, 0.3, 1) infinite, dads-spinner-bar-dash 2.5s cubic-bezier(0.4, 0, 0.3, 1) infinite',
    _motionReduce: { animation: 'none' },
  },
});

const linearBar = css({
  strokeDasharray: '100',
  strokeDashoffset: 'calc(100 - clamp(0, var(--value, 35), 100))',
  '[role=progressbar][data-indeterminate] &': {
    strokeDasharray: '35 65',
    animation: 'dads-linear-rotate 4s linear infinite',
    _motionReduce: { animation: 'none' },
  },
});

export type ProgressIndicatorProps = Omit<ComponentProps<'div'>, 'role' | 'type'> & {
  type: ProgressIndicatorType;
  /** Progress in percent (0–100). Omit for an indeterminate (looping) indicator. */
  value?: number;
  /** Renders nothing when `false`. */
  active?: boolean;
};

export const ProgressIndicator = (props: ProgressIndicatorProps) => {
  const { children, className, type, value, active = true, style, ...rest } = props;

  if (!active) return null;

  const normalizedValue =
    value !== undefined && Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : undefined;
  const mergedStyle =
    normalizedValue === undefined
      ? style
      : ({ ...style, '--value': String(normalizedValue) } as CSSProperties);

  return (
    <div
      className={cx(root({ type }), className)}
      role='progressbar'
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={normalizedValue}
      data-type={type}
      data-indeterminate={normalizedValue === undefined ? '' : undefined}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </div>
  );
};

type IndicatorProps = Omit<ComponentProps<'svg'>, 'children'> & {
  size?: ProgressIndicatorSize;
};

export type ProgressIndicatorSpinnerProps = IndicatorProps;

export const ProgressIndicatorSpinner = (props: ProgressIndicatorSpinnerProps) => {
  const { size = 'lg', ...rest } = props;
  const isLg = size === 'lg';
  const dimension = isLg ? 48 : 24;
  const center = dimension / 2;
  const radius = isLg ? 22 : 8;
  const strokeWidth = isLg ? 4 : 3;

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox={`0 0 ${dimension} ${dimension}`}
      stroke='currentColor'
      fill='none'
      aria-hidden='true'
      data-indicator='spinner'
      {...rest}
    >
      <circle className={track} cx={center} cy={center} r={radius} strokeWidth={strokeWidth} />
      <g className={spinnerOuter}>
        <g className={spinnerInner}>
          <circle
            className={cx(bar, spinnerBar)}
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            pathLength={100}
          />
        </g>
      </g>
      <circle className={bar} cx={center} cy={center} r={isLg ? 23.5 : 9.5} strokeWidth={1} />
    </svg>
  );
};

export type ProgressIndicatorLinearProps = IndicatorProps;

export const ProgressIndicatorLinear = (props: ProgressIndicatorLinearProps) => {
  const { size = 'lg', ...rest } = props;
  const width = size === 'lg' ? 240 : 80;

  return (
    <svg
      width={width}
      height={4}
      viewBox={`0 0 ${width} 4`}
      stroke='currentColor'
      fill='none'
      aria-hidden='true'
      data-indicator='linear'
      {...rest}
    >
      <line className={track} x1={0} y1={2} x2={width} y2={2} strokeWidth={4} />
      <line
        className={cx(bar, linearBar)}
        x1={0}
        y1={2}
        x2={width}
        y2={2}
        strokeWidth={4}
        pathLength={100}
      />
      <line className={bar} x1={0} y1={3.5} x2={width} y2={3.5} strokeWidth={1} />
    </svg>
  );
};

export type ProgressIndicatorStaticProps = IndicatorProps;

export const ProgressIndicatorStatic = (props: ProgressIndicatorStaticProps) => {
  const { size = 'lg', className, ...rest } = props;

  if (size === 'lg') {
    return (
      <svg
        width={48}
        height={48}
        viewBox='0 0 48 48'
        fill='none'
        aria-hidden='true'
        data-indicator='static'
        className={cx(bar, className)}
        {...rest}
      >
        <path
          fill='currentColor'
          d='M17 15c0 2.5 2.2 7 7 7s7-5 7-7H17ZM15 42h18c0-2-1-4.5-1-4.5L24 34l-8 3.5S15 40 15 42Z'
        />
        <path
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          d='M24 24C34.5 24 35.5 6 35.5 4.8V4M24 24C13.5 24 12.5 6 12.5 4.8V4M24 24c7 0 11.5 11.8 11.5 18.3V44M24 24c-7 0-11.5 11.8-11.5 18.3V44M9 4h30M9 44h30'
        />
        <circle cx={24} cy={28} r={1} fill='currentColor' />
        <circle cx={24} cy={31} r={1} fill='currentColor' />
      </svg>
    );
  }

  return (
    <svg
      width={24}
      height={24}
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
      data-indicator='static'
      className={cx(bar, className)}
      {...rest}
    >
      <path
        fill='currentColor'
        d='M9 6c0 1.8 1.1 5 3.5 5S16 7.4 16 6H9ZM8 21h9c0-1-.5-2.2-.5-2.2l-4-1.8-4 1.8S8 20 8 21Z'
      />
      <path
        fill='none'
        stroke='currentColor'
        d='M4 1.5h17m-17 21h17M6 1.5C6 5.1 7.6 12 12.5 12S18.9 5 19 1.5M19 22.5c.3-3.7-2.2-10.5-6.5-10.5S5.7 18.8 6 22.5'
      />
      <circle cx={12.5} cy={13.5} r={0.5} fill='currentColor' />
      <circle cx={12.5} cy={15.5} r={0.5} fill='currentColor' />
    </svg>
  );
};
