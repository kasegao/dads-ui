import { DatePicker as ArkDatePicker, useDatePickerContext } from '@ark-ui/react/date-picker';
import type { ComponentProps } from 'react';
import { css, cx, sva } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';
import { Button } from '../Button';
import { type CalendarValueProps, toArkDatePickerProps } from './calendarProps';

const calendar = sva({
  slots: [
    'root',
    'view',
    'controls',
    'yearSelect',
    'navigation',
    'currentMonth',
    'table',
    'headerCell',
    'dataCell',
    'date',
    'footer',
  ],
  base: {
    root: {
      width: 'max',
      maxWidth: 'full',
    },
    view: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 'max',
      color: 'solid-gray.800',
      textStyle: 'oln-16N-100',
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      columnGap: '8',
      padding: '16',
    },
    yearSelect: {
      display: 'inline-block',
      width: 'fit',
      maxWidth: 'full',
      height: '44',
      appearance: 'none',
      borderWidth: '1',
      borderStyle: 'solid',
      borderColor: 'solid-gray.600',
      borderRadius: '8',
      backgroundColor: 'white',
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%3E%3Cpath%20fill='%231a1a1a'%20d='M12%2017.1%203%208l1-1%208%208%208-8%201%201z'/%3E%3C/svg%3E\")",
      backgroundRepeat: 'no-repeat',
      backgroundSize: '1rem 1rem',
      backgroundPosition: 'right 1rem center',
      paddingLeft: '16',
      paddingRight: '40',
      paddingBlock: '0.6875rem',
      color: 'solid-gray.800',
      textStyle: 'oln-16N-100',
      _forcedColors: { appearance: 'auto', backgroundImage: 'none' },
      _hover: { borderColor: 'black' },
      _focus: { ...focusRing },
      _disabled: {
        borderColor: 'solid-gray.300',
        backgroundColor: 'solid-gray.50',
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%3E%3Cpath%20fill='%23949494'%20d='M12%2017.1%203%208l1-1%208%208%208-8%201%201z'/%3E%3C/svg%3E\")",
        color: 'solid-gray.420',
        pointerEvents: 'none',
        _forcedColors: { borderColor: 'GrayText', backgroundImage: 'none', color: 'GrayText' },
      },
    },
    navigation: {
      display: 'flex',
      alignItems: 'center',
    },
    currentMonth: {
      width: '56',
      textAlign: 'center',
    },
    table: {
      marginInline: '12',
      marginBottom: '8',
      width: 'auto',
      borderCollapse: 'collapse',
    },
    headerCell: {
      width: '48',
      height: '48',
      padding: '0',
      color: 'solid-gray.700',
      fontWeight: '700',
      textAlign: 'center',
      verticalAlign: 'middle',
    },
    dataCell: {
      padding: '0',
    },
    date: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '4',
      width: '40',
      height: '40',
      borderRadius: 'full',
      borderWidth: '1',
      borderStyle: 'solid',
      borderColor: 'transparent',
      textUnderlineOffset: '0.1875rem',
      cursor: 'pointer',
      '&:not([data-selected])': {
        _hoverable: {
          _hover: {
            borderColor: 'black',
            backgroundColor: 'solid-gray.50',
            textDecorationLine: 'underline',
          },
        },
        _active: { backgroundColor: 'solid-gray.100' },
        _focusVisible: { backgroundColor: 'yellow.300' },
      },
      _focusVisible: { ...focusRing },
      '&[data-selected]': {
        backgroundColor: 'key.900',
        color: 'white',
      },
      // Days of adjacent months and days beyond min / max are not shown.
      '&:is([data-outside-range], [aria-invalid=true])': {
        visibility: 'hidden',
      },
      '&[data-unavailable]:not([aria-invalid=true])': {
        color: 'solid-gray.420',
        pointerEvents: 'none',
        _forcedColors: { color: 'GrayText' },
      },
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      alignSelf: 'stretch',
      columnGap: '16',
      padding: '16',
    },
  },
});

/** Month navigation (prev/next) button. */
const navButton = css({
  position: 'relative',
  display: 'flex',
  flexShrink: '0',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44',
  height: '44',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'current',
  borderRadius: '6',
  backgroundColor: 'white',
  color: 'key.900',
  cursor: 'pointer',
  _hover: { borderWidth: '3', color: 'key.1000' },
  _active: { borderWidth: '3', color: 'key.1200' },
  _focusVisible: { ...focusRing },
  _disabled: {
    pointerEvents: 'none',
    color: 'solid-gray.300',
    _forcedColors: { borderColor: 'GrayText', color: 'GrayText' },
  },
});

const eraFormatter = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
  era: 'long',
  year: 'numeric',
});

/** `2025` → `2025年(令和7年)`. The era is the one in effect at the end of the year. */
const formatYearLabel = (year: number) => {
  const parts = eraFormatter.formatToParts(new Date(year, 11, 31));
  const era = parts.find((part) => part.type === 'era')?.value ?? '';
  const eraYear = parts.find((part) => part.type === 'year')?.value ?? '';
  return `${year}年(${era}${eraYear}年)`;
};

export type CalendarHeaderProps = ComponentProps<'div'>;

/** Year select and previous / next month buttons. */
export const CalendarHeader = (props: CalendarHeaderProps) => {
  const { className, ...rest } = props;
  const api = useDatePickerContext();
  const styles = calendar();
  const visible = api.visibleRange.start;

  return (
    <div className={cx(styles.controls, className)} {...rest}>
      <select
        className={styles.yearSelect}
        aria-label='年'
        disabled={api.disabled}
        value={visible.year}
        onChange={(event) => api.focusYear(Number(event.target.value))}
      >
        {api.getYears().map((year) => (
          <option key={year.value} value={year.value} disabled={year.disabled}>
            {formatYearLabel(year.value)}
          </option>
        ))}
      </select>
      <div className={styles.navigation}>
        <ArkDatePicker.PrevTrigger className={navButton}>
          <svg width='16' height='16' viewBox='0 0 16 16' aria-hidden={true}>
            <path
              d='m5.27 8 5.33-5.33-.93-.94L3.4 8l6.27 6.27.93-.94L5.27 8Z'
              fill='currentcolor'
            />
          </svg>
        </ArkDatePicker.PrevTrigger>
        <p className={styles.currentMonth}>{visible.month}月</p>
        <ArkDatePicker.NextTrigger className={navButton}>
          <svg width='16' height='16' viewBox='0 0 16 16' aria-hidden={true}>
            <path d='m6 1.73-.93.94L10.4 8l-5.33 5.33.93.94L12.27 8 6 1.73Z' fill='currentcolor' />
          </svg>
        </ArkDatePicker.NextTrigger>
      </div>
    </div>
  );
};

export type CalendarGridProps = Omit<ComponentProps<'table'>, 'children'>;

/** The month grid. Arrow keys move between dates; Enter / Space selects. */
export const CalendarGrid = (props: CalendarGridProps) => {
  const { className, ...rest } = props;
  const api = useDatePickerContext();
  const styles = calendar();

  return (
    <ArkDatePicker.Table className={cx(styles.table, className)} {...rest}>
      <ArkDatePicker.TableHead>
        <ArkDatePicker.TableRow>
          {api.weekDays.map((weekDay) => (
            <ArkDatePicker.TableHeader key={weekDay.long} className={styles.headerCell}>
              {weekDay.narrow}
            </ArkDatePicker.TableHeader>
          ))}
        </ArkDatePicker.TableRow>
      </ArkDatePicker.TableHead>
      <ArkDatePicker.TableBody>
        {api.weeks.map((week) => (
          <ArkDatePicker.TableRow key={week[0]?.toString()}>
            {week.map((day) => (
              <ArkDatePicker.TableCell key={day.toString()} className={styles.dataCell} value={day}>
                <ArkDatePicker.TableCellTrigger className={styles.date}>
                  {day.day}
                </ArkDatePicker.TableCellTrigger>
              </ArkDatePicker.TableCell>
            ))}
          </ArkDatePicker.TableRow>
        ))}
      </ArkDatePicker.TableBody>
    </ArkDatePicker.Table>
  );
};

export type CalendarFooterProps = ComponentProps<'div'>;

/** "削除" (clear) and "今日" (select today) buttons. */
export const CalendarFooter = (props: CalendarFooterProps) => {
  const { className, ...rest } = props;
  const api = useDatePickerContext();
  const styles = calendar();
  const isLocked = api.disabled || api.readOnly;

  // Like picking a date, these complete the selection, so a popup calendar closes.
  const closePopup = () => {
    if (!api.inline) api.setOpen(false);
  };

  return (
    <div className={cx(styles.footer, className)} {...rest}>
      <Button
        variant='text'
        size='sm'
        disabled={isLocked}
        onClick={() => {
          api.clearValue();
          closePopup();
        }}
      >
        削除
      </Button>
      <Button
        variant='outline'
        size='sm'
        disabled={isLocked}
        onClick={() => {
          api.selectToday();
          closePopup();
        }}
      >
        今日
      </Button>
    </div>
  );
};

export type CalendarViewProps = ComponentProps<'div'>;

/**
 * The calendar layout. Must be rendered inside `Calendar` or a date picker's popup.
 * Without children it renders `CalendarHeader`, `CalendarGrid` and `CalendarFooter`.
 */
export const CalendarView = (props: CalendarViewProps) => {
  const { className, children, ...rest } = props;

  return (
    <ArkDatePicker.View view='day' className={cx(calendar().view, className)} {...rest}>
      {children ?? (
        <>
          <CalendarHeader />
          <CalendarGrid />
          <CalendarFooter />
        </>
      )}
    </ArkDatePicker.View>
  );
};

export type CalendarProps = CalendarValueProps &
  Omit<ComponentProps<'div'>, keyof CalendarValueProps | 'dir'>;

/** Inline calendar (ja-JP). Dates are ISO 8601 strings such as `2025-02-18`. */
export const Calendar = (props: CalendarProps) => {
  const {
    className,
    children,
    value,
    defaultValue,
    onValueChange,
    focusedValue,
    defaultFocusedValue,
    onFocusChange,
    min,
    max,
    isDateUnavailable,
    disabled,
    readOnly,
    timeZone,
    ...rest
  } = props;

  const arkProps = toArkDatePickerProps({
    value,
    defaultValue,
    onValueChange,
    focusedValue,
    defaultFocusedValue,
    onFocusChange,
    min,
    max,
    isDateUnavailable,
    disabled,
    readOnly,
    timeZone,
  });

  return (
    <ArkDatePicker.Root
      className={cx(calendar().root, className)}
      inline={true}
      {...arkProps}
      {...rest}
    >
      <ArkDatePicker.Content>
        <CalendarView>{children}</CalendarView>
      </ArkDatePicker.Content>
    </ArkDatePicker.Root>
  );
};
