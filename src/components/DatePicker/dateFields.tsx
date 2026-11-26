import { DatePicker as ArkDatePicker, parseDate, useDatePicker } from '@ark-ui/react/date-picker';
import {
  type ChangeEvent,
  type ComponentProps,
  createContext,
  type FocusEvent,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { type CalendarValueProps, toArkDatePickerProps } from '../Calendar/calendarProps';

export type DateFieldPart = 'year' | 'month' | 'day';
export type DateFieldsSize = 'lg' | 'md' | 'sm';

type Fields = Partial<Record<DateFieldPart, string>>;

type DateFieldsContextValue = {
  size: DateFieldsSize;
  isError: boolean;
  isReadonly: boolean;
  isDisabled: boolean;
  fields: Fields;
  setField: (part: DateFieldPart, value: string) => void;
  commit: () => void;
};

const DateFieldsContext = createContext<DateFieldsContextValue | null>(null);

export const useDateFieldsContext = () => {
  const context = useContext(DateFieldsContext);
  if (!context) {
    throw new Error('Date picker parts must be rendered inside a date picker root.');
  }
  return context;
};

const daysInMonth = (year: number, month: number) => {
  if (month === 2) {
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return isLeap ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
};

const pad = (value: number, length: number) => String(value).padStart(length, '0');

/** Returns `YYYY-MM-DD` when the three fields form a real date, otherwise `null`. */
const fieldsToIso = (fields: Fields) => {
  const { year = '', month = '', day = '' } = fields;
  if (![year, month, day].every((value) => /^\d+$/.test(value))) return null;

  const [y, m, d] = [Number(year), Number(month), Number(day)];
  if (y < 1 || y > 9999 || m < 1 || m > 12 || d < 1 || d > daysInMonth(y, m)) return null;

  return `${pad(y, 4)}-${pad(m, 2)}-${pad(d, 2)}`;
};

const isoToFields = (iso: string | null | undefined): Fields => {
  if (!iso) return {};
  const date = parseDate(iso);
  return { year: String(date.year), month: pad(date.month, 2), day: pad(date.day, 2) };
};

/**
 * Reflects a new picker value in the text fields without rewriting what the user typed:
 * fields that already express the value are kept, and clearing only empties fields that
 * held a complete date.
 */
const syncFields = (fields: Fields, iso: string | null): Fields => {
  const current = fieldsToIso(fields);
  if (iso === current) return fields;
  if (iso === null) return current === null ? fields : { year: '', month: '', day: '' };
  return isoToFields(iso);
};

export type DateFieldsRootProps = CalendarValueProps &
  Omit<ComponentProps<'div'>, keyof CalendarValueProps | 'dir'> & {
    size?: DateFieldsSize;
    isError?: boolean;
    isReadonly?: boolean;
    isDisabled?: boolean;
    /** Class name of the element that lays out the fields and the calendar button. */
    controlClassName?: string;
    children?: ReactNode;
  };

/**
 * Shared root of `DatePicker` and `SeparatedDatePicker`: an Ark UI date picker whose value
 * is kept in sync with native year / month / day inputs.
 */
export const DateFieldsRoot = (props: DateFieldsRootProps) => {
  const {
    children,
    controlClassName,
    size = 'lg',
    isError = false,
    isReadonly = false,
    isDisabled = false,
    value,
    defaultValue,
    onValueChange,
    focusedValue,
    defaultFocusedValue,
    onFocusChange,
    min,
    max,
    isDateUnavailable,
    timeZone,
    ...rest
  } = props;

  const [fields, setFields] = useState<Fields>(() => isoToFields(value ?? defaultValue));

  const api = useDatePicker({
    ...toArkDatePickerProps({
      value,
      defaultValue,
      focusedValue,
      defaultFocusedValue,
      onFocusChange,
      min,
      max,
      isDateUnavailable,
      timeZone,
      disabled: isDisabled,
      readOnly: isReadonly,
      onValueChange: (next) => {
        setFields((prev) => syncFields(prev, next));
        onValueChange?.(next);
      },
    }),
    invalid: isError,
    positioning: { placement: 'bottom-start', gutter: 8 },
  });

  useEffect(() => {
    if (value !== undefined) {
      setFields((prev) => syncFields(prev, value));
    }
  }, [value]);

  const commit = () => {
    const typed = fieldsToIso(fields);
    const isSelectable = typed !== null && (!min || typed >= min) && (!max || typed <= max);
    const next = isSelectable ? typed : null;
    const current = api.value[0]?.toString() ?? null;
    if (next !== current) {
      api.setValue(next ? [parseDate(next)] : []);
    }
  };

  const context: DateFieldsContextValue = {
    size,
    isError,
    isReadonly,
    isDisabled,
    fields,
    setField: (part, fieldValue) => setFields((prev) => ({ ...prev, [part]: fieldValue })),
    commit,
  };

  return (
    <DateFieldsContext.Provider value={context}>
      <ArkDatePicker.RootProvider value={api} {...rest}>
        <ArkDatePicker.Control className={controlClassName}>{children}</ArkDatePicker.Control>
      </ArkDatePicker.RootProvider>
    </DateFieldsContext.Provider>
  );
};

export type DateFieldInputProps = Omit<ComponentProps<'input'>, 'placeholder' | 'type'>;

/**
 * Props for a native year / month / day input bound to the picker value. An input given its
 * own `value` stays controlled by the caller and does not take part in the picker value.
 */
export const useDateFieldInput = (part: DateFieldPart, props: DateFieldInputProps) => {
  const { fields, setField, commit, isError, isReadonly, isDisabled } = useDateFieldsContext();
  const {
    value,
    defaultValue,
    onChange,
    onBlur,
    readOnly,
    'aria-disabled': ariaDisabled,
    'aria-invalid': ariaInvalid,
    ...rest
  } = props;

  const initial = defaultValue === undefined ? undefined : String(defaultValue);

  // biome-ignore lint/correctness/useExhaustiveDependencies: seeds the field once on mount
  useEffect(() => {
    if (initial !== undefined && value === undefined && fields[part] === undefined) {
      setField(part, initial);
    }
  }, []);

  const disabled = ariaDisabled === true || ariaDisabled === 'true' || isDisabled;

  return {
    type: 'text',
    inputMode: 'numeric',
    pattern: '\\d+',
    ...rest,
    value: value ?? fields[part] ?? initial ?? '',
    readOnly: disabled || isReadonly || readOnly,
    'aria-disabled': disabled || undefined,
    'aria-invalid': ariaInvalid ?? (isError || undefined),
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) setField(part, event.target.value);
      onChange?.(event);
    },
    onBlur: (event: FocusEvent<HTMLInputElement>) => {
      if (value === undefined) commit();
      onBlur?.(event);
    },
  } satisfies ComponentProps<'input'>;
};
