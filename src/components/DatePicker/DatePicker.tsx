import { DatePicker as ArkDatePicker } from '@ark-ui/react/date-picker';
import type { ComponentProps, KeyboardEvent } from 'react';
import { css, cva, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';
import { CalendarView } from '../Calendar';
import {
  type DateFieldInputProps,
  type DateFieldPart,
  DateFieldsRoot,
  type DateFieldsRootProps,
  type DateFieldsSize,
  useDateFieldInput,
  useDateFieldsContext,
} from './dateFields';

export type DatePickerSize = DateFieldsSize;

const root = css({
  color: 'solid-gray.800',
  textStyle: 'std-16N-170',
});

const control = css({
  display: 'flex',
  alignItems: 'flex-end',
  columnGap: '16',
});

export type DatePickerProps = Omit<DateFieldsRootProps, 'controlClassName'>;

/**
 * Consolidated date picker (ja-JP): year / month / day inputs in one box, optionally with a
 * calendar popup. The value is an ISO 8601 string such as `2025-02-18`.
 */
export const DatePicker = (props: DatePickerProps) => {
  const { className, ...rest } = props;

  return <DateFieldsRoot className={cx(root, className)} controlClassName={control} {...rest} />;
};

const fields = cva({
  base: {
    display: 'inline-flex',
    borderWidth: '1',
    borderRadius: '8',
    // The unit labels paint the same background to cover the edges of the inputs.
    '--date-picker-bg': '{colors.white}',
    backgroundColor: 'var(--date-picker-bg)',
    paddingBlock: '2',
    paddingInlineStart: '2',
    paddingInlineEnd: '0',
    color: 'solid-gray.900',
    // The zero-width space exposes the first-line baseline in Safari.
    _before: { alignSelf: 'center', content: '"\\200B"' },
    '& > * + *': { marginInlineStart: '-4px' },
  },
  variants: {
    size: {
      lg: { height: '56' },
      md: { height: '48' },
      sm: { height: '40' },
    },
    status: {
      default: {
        borderStyle: 'solid',
        borderColor: 'solid-gray.600',
        _focusWithin: { borderColor: 'black' },
        _hover: { borderColor: 'solid-gray.900' },
      },
      error: {
        borderStyle: 'solid',
        borderColor: 'error.1',
        _focusWithin: { borderColor: 'red.1000' },
        _hover: { borderColor: 'red.1000' },
      },
      readonly: {
        borderStyle: 'dashed',
        borderColor: 'solid-gray.600',
        _focusWithin: { borderColor: 'black' },
      },
      readonlyError: {
        borderStyle: 'dashed',
        borderColor: 'error.1',
        _focusWithin: { borderColor: 'red.1000' },
      },
      disabled: {
        borderStyle: 'solid',
        borderColor: 'solid-gray.300',
        '--date-picker-bg': '{colors.solid-gray.50}',
        color: 'solid-gray.420',
        _forcedColors: { borderColor: 'GrayText', color: 'GrayText' },
      },
    },
  },
});

const getStatus = (state: { isError: boolean; isReadonly: boolean; isDisabled: boolean }) => {
  if (state.isDisabled) return 'disabled';
  if (state.isReadonly) return state.isError ? 'readonlyError' : 'readonly';
  return state.isError ? 'error' : 'default';
};

const moveFocus = (event: KeyboardEvent<HTMLDivElement>, direction: 1 | -1) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || input.selectionStart !== input.selectionEnd) return;

  const caret = input.selectionStart;
  const isAtEdge = direction === 1 ? caret === input.value.length : caret === 0;
  if (!isAtEdge) return;

  event.preventDefault();
  const inputs = Array.from(event.currentTarget.querySelectorAll('input'));
  inputs[inputs.indexOf(input) + direction]?.focus();
};

export type DatePickerFieldsProps = ComponentProps<'div'>;

/**
 * The box that groups `DatePickerYear`, `DatePickerMonth` and `DatePickerDate`.
 * The left / right arrow keys move between the inputs; non-digit keys are ignored.
 */
export const DatePickerFields = (props: DatePickerFieldsProps) => {
  const { className, onKeyDown, ...rest } = props;
  const context = useDateFieldsContext();

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.key === 'ArrowRight') {
      moveFocus(event, 1);
    } else if (event.key === 'ArrowLeft') {
      moveFocus(event, -1);
    } else if (/^[^0-9]$/.test(event.key) && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
    }
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: keyboard navigation between the inputs
    <div
      className={cx(fields({ size: context.size, status: getStatus(context) }), className)}
      onKeyDown={handleKeyDown}
      {...rest}
    />
  );
};

const fieldLabel = css({
  position: 'relative',
  zIndex: '0',
  display: 'inline-flex',
  flexDirection: 'row-reverse',
  _last: { paddingInlineEnd: '16' },
  '&:has([aria-disabled=true])': { pointerEvents: 'none' },
});

const fieldUnit = css({
  position: 'relative',
  zIndex: '10',
  alignSelf: 'center',
  backgroundColor: 'var(--date-picker-bg)',
  padding: '4',
  textStyle: 'oln-16N-100',
});

const fieldInput = cva({
  base: {
    marginInlineEnd: '-4px',
    borderWidth: '1',
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: '8',
    backgroundColor: 'transparent',
    paddingInlineEnd: '12',
    textAlign: 'right',
    _focus: { ...focusRing, borderColor: 'solid-gray.600' },
    _ariaDisabled: { pointerEvents: 'none' },
    _forcedColors: {
      borderColor: 'Canvas',
      '&[aria-disabled=true]:focus': { borderColor: 'GrayText' },
    },
  },
  variants: {
    part: {
      year: { width: '64' },
      month: { width: '44' },
      day: { width: '44' },
    },
  },
});

const units = { year: '年', month: '月', day: '日' } as const;

const DatePickerField = (props: DateFieldInputProps & { field: DateFieldPart }) => {
  const { field: part, className, ...rest } = props;
  const inputProps = useDateFieldInput(part, rest);

  return (
    <label className={fieldLabel}>
      <span className={fieldUnit}>{units[part]}</span>
      <input className={cx(fieldInput({ part }), className)} {...inputProps} />
    </label>
  );
};

export type DatePickerYearProps = DateFieldInputProps;
export const DatePickerYear = (props: DatePickerYearProps) => (
  <DatePickerField field='year' {...props} />
);

export type DatePickerMonthProps = DateFieldInputProps;
export const DatePickerMonth = (props: DatePickerMonthProps) => (
  <DatePickerField field='month' {...props} />
);

export type DatePickerDateProps = DateFieldInputProps;
export const DatePickerDate = (props: DatePickerDateProps) => (
  <DatePickerField field='day' {...props} />
);

const calendarButton = cva({
  base: {
    display: 'flex',
    flexShrink: '0',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: '4',
    borderWidth: '1',
    borderStyle: 'solid',
    borderColor: 'key.900',
    borderRadius: '6',
    backgroundColor: 'white',
    paddingInline: '12',
    color: 'key.900',
    cursor: 'pointer',
    '&:not(:disabled)': {
      _hover: { borderWidth: '3', paddingInline: '10' },
    },
    _focusVisible: { ...focusRing },
    _disabled: {
      borderColor: 'solid-gray.300',
      color: 'solid-gray.300',
      cursor: 'default',
      _forcedColors: { borderColor: 'GrayText', color: 'GrayText' },
    },
    '& > svg:last-child': { width: '16', height: '16' },
    _expanded: { '& > svg:last-child': { rotate: '180deg' } },
  },
  variants: {
    size: {
      lg: { height: '56' },
      md: { height: '48' },
      sm: { height: '40' },
    },
  },
});

export type DatePickerCalendarButtonProps = Omit<ComponentProps<'button'>, 'children'>;

/** Button that opens the calendar popup. Its accessible name is "カレンダー". */
export const DatePickerCalendarButton = (props: DatePickerCalendarButtonProps) => {
  const { className, ...rest } = props;
  const { size } = useDateFieldsContext();

  return (
    <ArkDatePicker.Trigger
      className={cx(calendarButton({ size }), className)}
      aria-haspopup='dialog'
      {...rest}
    >
      <svg width='24' height='24' viewBox='0 -960 960 960' aria-hidden={true}>
        <path
          d='M360-300q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Z'
          fill='currentcolor'
        />
      </svg>
      <svg viewBox='0 0 24 24' aria-hidden={true}>
        <path d='M12 17.1L3 8L4 7L12 15L20 7L21 8L12 17.1Z' fill='currentcolor' />
      </svg>
    </ArkDatePicker.Trigger>
  );
};

const popup = css({
  zIndex: 'dropdown',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'solid-gray.420',
  borderRadius: '8',
  backgroundColor: 'white',
  boxShadow: '1',
  _focus: { outlineWidth: '0' },
});

export type DatePickerCalendarProps = ComponentProps<'div'>;

/**
 * Calendar popup (a dialog named "カレンダー"). Without children it renders the default
 * calendar; pass `CalendarHeader` / `CalendarGrid` / `CalendarFooter` to customize it.
 */
export const DatePickerCalendar = (props: DatePickerCalendarProps) => {
  const { className, children, ...rest } = props;

  return (
    <ArkDatePicker.Positioner>
      <ArkDatePicker.Content className={cx(popup, className)} role='dialog' {...rest}>
        <CalendarView>{children}</CalendarView>
      </ArkDatePicker.Content>
    </ArkDatePicker.Positioner>
  );
};
