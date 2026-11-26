import type { ComponentProps } from 'react';
import { css, cva, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';
import {
  DatePickerCalendar,
  DatePickerCalendarButton,
  type DatePickerCalendarButtonProps,
  type DatePickerCalendarProps,
} from '../DatePicker';
import {
  type DateFieldInputProps,
  type DateFieldPart,
  DateFieldsRoot,
  type DateFieldsRootProps,
  type DateFieldsSize,
  useDateFieldInput,
  useDateFieldsContext,
} from '../DatePicker/dateFields';

export type SeparatedDatePickerSize = DateFieldsSize;

const root = css({
  color: 'solid-gray.800',
  textStyle: 'std-16N-170',
});

const control = css({
  display: 'flex',
  alignItems: 'flex-end',
  columnGap: '16',
});

export type SeparatedDatePickerProps = Omit<DateFieldsRootProps, 'controlClassName'>;

/**
 * Separated date picker (ja-JP): individual year / month / day inputs, optionally with a
 * calendar popup. The value is an ISO 8601 string such as `2025-02-18`.
 */
export const SeparatedDatePicker = (props: SeparatedDatePickerProps) => {
  const { className, ...rest } = props;

  return <DateFieldsRoot className={cx(root, className)} controlClassName={control} {...rest} />;
};

const fieldsWrapper = css({
  display: 'inline-block',
  paddingTop: '12',
});

const fields = cva({
  base: {
    display: 'flex',
    columnGap: '16',
    color: 'solid-gray.900',
  },
  variants: {
    size: {
      lg: { height: '56' },
      md: { height: '48' },
      sm: { height: '40' },
    },
  },
});

export type SeparatedDatePickerFieldsProps = ComponentProps<'div'>;

/** Groups `SeparatedDatePickerYear`, `SeparatedDatePickerMonth` and `SeparatedDatePickerDate`. */
export const SeparatedDatePickerFields = (props: SeparatedDatePickerFieldsProps) => {
  const { className, ...rest } = props;
  const { size } = useDateFieldsContext();

  return (
    <div className={fieldsWrapper}>
      <div className={cx(fields({ size }), className)} {...rest} />
    </div>
  );
};

const fieldLabel = css({
  position: 'relative',
  '&:has([aria-disabled=true])': { pointerEvents: 'none' },
});

const fieldUnit = css({
  position: 'absolute',
  insetInline: '0',
  top: '-12px',
  marginInline: 'auto',
  width: '24',
  backgroundColor: 'white',
  padding: '4',
  textStyle: 'oln-16N-100',
  '&:has(+ [aria-disabled=true])': {
    color: 'solid-gray.420',
    _forcedColors: { color: 'GrayText' },
  },
});

const fieldInput = cva({
  base: {
    height: 'full',
    borderWidth: '1',
    borderStyle: 'solid',
    borderColor: 'solid-gray.600',
    borderRadius: '8',
    backgroundColor: 'white',
    textAlign: 'center',
    _focus: { ...focusRing },
    // Editable and valid: the border darkens on hover and focus.
    '&:not(:read-only):not([aria-invalid=true])': {
      _hover: { borderColor: 'solid-gray.900' },
      _focus: { borderColor: 'solid-gray.900' },
    },
    '&[aria-invalid=true]': {
      borderColor: 'error.1',
      _hover: { borderColor: 'red.1000' },
    },
    '&:read-only:not([aria-disabled=true])': { borderStyle: 'dashed' },
    _ariaDisabled: {
      borderColor: 'solid-gray.600',
      backgroundColor: 'solid-gray.50',
      color: 'solid-gray.420',
      pointerEvents: 'none',
      _forcedColors: { borderColor: 'GrayText', color: 'GrayText' },
    },
  },
  variants: {
    part: {
      year: { width: '72' },
      month: { width: '56' },
      day: { width: '56' },
    },
  },
});

const units = { year: '年', month: '月', day: '日' } as const;

const SeparatedDatePickerField = (props: DateFieldInputProps & { field: DateFieldPart }) => {
  const { field: part, className, ...rest } = props;
  const inputProps = useDateFieldInput(part, rest);

  return (
    <label className={fieldLabel}>
      <span className={fieldUnit}>{units[part]}</span>
      <input className={cx(fieldInput({ part }), className)} {...inputProps} />
    </label>
  );
};

export type SeparatedDatePickerYearProps = DateFieldInputProps;
export const SeparatedDatePickerYear = (props: SeparatedDatePickerYearProps) => (
  <SeparatedDatePickerField field='year' {...props} />
);

export type SeparatedDatePickerMonthProps = DateFieldInputProps;
export const SeparatedDatePickerMonth = (props: SeparatedDatePickerMonthProps) => (
  <SeparatedDatePickerField field='month' {...props} />
);

export type SeparatedDatePickerDateProps = DateFieldInputProps;
export const SeparatedDatePickerDate = (props: SeparatedDatePickerDateProps) => (
  <SeparatedDatePickerField field='day' {...props} />
);

export type SeparatedDatePickerCalendarButtonProps = DatePickerCalendarButtonProps;
export const SeparatedDatePickerCalendarButton = DatePickerCalendarButton;

export type SeparatedDatePickerCalendarProps = DatePickerCalendarProps;
export const SeparatedDatePickerCalendar = DatePickerCalendar;
