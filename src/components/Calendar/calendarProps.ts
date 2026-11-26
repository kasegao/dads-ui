import {
  type DatePickerValueChangeDetails,
  parseDate,
  type UseDatePickerProps,
} from '@ark-ui/react/date-picker';

/** Props shared by `Calendar` and the date pickers. Dates are ISO 8601 strings (`YYYY-MM-DD`). */
export type CalendarValueProps = {
  /** Selected date. `null` means no selection (controlled). */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Date whose month is displayed (controlled). */
  focusedValue?: string;
  defaultFocusedValue?: string;
  onFocusChange?: (value: string) => void;
  /** First selectable date. */
  min?: string;
  /** Last selectable date. */
  max?: string;
  isDateUnavailable?: (date: string) => boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Time zone used to resolve "today". Defaults to the browser's time zone. */
  timeZone?: string;
};

const translations: UseDatePickerProps['translations'] = {
  dayCell: (state) => {
    if (state.selected) return `${state.valueText} 選択中`;
    if (state.today) return `本日、${state.valueText}`;
    return state.valueText;
  },
  prevTrigger: () => '前の月',
  nextTrigger: () => '次の月',
  trigger: () => 'カレンダー',
  content: 'カレンダー',
  yearSelect: '年',
  monthSelect: '月',
  clearTrigger: '削除',
};

const toDateValue = (value: string | undefined) => (value ? parseDate(value) : undefined);

const toDateValues = (value: string | null | undefined) => {
  if (value === undefined) return undefined;
  return value ? [parseDate(value)] : [];
};

/** Translates the string based DADS props into Ark UI date picker props (ja-JP). */
export const toArkDatePickerProps = (props: CalendarValueProps): UseDatePickerProps => {
  const { onValueChange, onFocusChange, isDateUnavailable } = props;

  const arkProps: UseDatePickerProps = {
    locale: 'ja-JP',
    timeZone: props.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    selectionMode: 'single',
    minView: 'day',
    maxView: 'day',
    translations,
    value: toDateValues(props.value),
    defaultValue: toDateValues(props.defaultValue),
    focusedValue: toDateValue(props.focusedValue),
    defaultFocusedValue: toDateValue(props.defaultFocusedValue),
    min: toDateValue(props.min),
    max: toDateValue(props.max),
    disabled: props.disabled,
    readOnly: props.readOnly,
    isDateUnavailable: isDateUnavailable ? (date) => isDateUnavailable(date.toString()) : undefined,
    onValueChange: onValueChange
      ? (details: DatePickerValueChangeDetails) =>
          onValueChange(details.value[0]?.toString() ?? null)
      : undefined,
    onFocusChange: onFocusChange
      ? (details) => onFocusChange(details.focusedValue.toString())
      : undefined,
  };

  // Ark treats an explicit `undefined` as "set", which would discard its defaults.
  return Object.fromEntries(Object.entries(arkProps).filter(([, value]) => value !== undefined));
};
